import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

/**
 * @fileOverview Hardened Razorpay Order Node.
 * Ensures amount is in whole paise and receipt ID is strictly alphanumeric.
 */

export async function POST(request: Request) {
  try {
    const { amount, planId } = await request.json();

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[GATEWAY_ERROR]: Missing Razorpay Credentials');
      return NextResponse.json({ error: 'Gateway keys missing.' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // 1. Convert to whole integer paise (Razorpay Protocol)
    const amountInPaise = Math.round(Number(amount) * 100);

    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json({ error: 'Min 1 INR required.' }, { status: 400 });
    }

    // 2. Alphanumeric short receipt (Strictly Alphanumeric)
    const receipt = `rcpt_${Date.now().toString().slice(-6)}_${planId.slice(0, 5)}`.replace(/[^a-zA-Z0-9_]/g, '');

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: 'INR',
    });
  } catch (error: any) {
    console.error('[RAZORPAY_ORDER_FAILURE]:', error);
    return NextResponse.json({ error: error.message || 'Order generation failed.' }, { status: 500 });
  }
}

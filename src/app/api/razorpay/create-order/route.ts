
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

/**
 * @fileOverview Hardened Backend Node for Razorpay Order Creation.
 * FIXED: Explicit type casting and receipt length validation for production stability.
 */

export async function POST(request: Request) {
  try {
    const { amount, planId } = await request.json();

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[RAZORPAY_CONFIG_ERR]: Missing API Keys in environment.');
      return NextResponse.json({ 
        error: 'Gateway configuration error: Keys missing on server.',
        code: 'MISSING_ENV_VARS'
      }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // 1. Calculate amount in paise (1 INR = 100 paise)
    // Forced integer rounding to prevent gateway float rejection
    const amountInPaise = Math.round(Number(amount) * 100);

    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json({ 
        error: 'Invalid amount: Minimum ₹1 (100 paise) required.',
        code: 'INVALID_AMOUNT'
      }, { status: 400 });
    }

    // 2. Generate Receipt (Strictly < 40 chars per Razorpay requirements)
    const receiptId = `rcpt_${Date.now().toString().slice(-10)}_${planId.slice(0, 5)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
    };

    const order = await razorpay.orders.create(options);

    console.log('[RAZORPAY_SUCCESS]: Order Generated:', order.id);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('[RAZORPAY_GATEWAY_ERR]:', error);
    return NextResponse.json({ 
      error: error.message || 'Order generation failed',
      details: error.description || 'Internal Gateway Communication Error'
    }, { status: 500 });
  }
}

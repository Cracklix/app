
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Secure Razorpay Order Creation Node.
 * Handles server-side order generation to protect sensitive keys.
 */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { planId, userId } = await req.json();
    const { firestore: db } = initializeFirebase();

    if (!userId || !planId) {
      return NextResponse.json({ error: 'Missing mandatory session data.' }, { status: 400 });
    }

    // 1. Audit Plan Registry
    const planSnap = await getDoc(doc(db, "passes", planId));
    if (!planSnap.exists()) {
      return NextResponse.json({ error: 'Invalid Pass Node.' }, { status: 404 });
    }
    const planData = planSnap.data();

    // 2. Razorpay Order Generation
    const amountInPaise = Math.round(planData.price * 100);
    
    if (amountInPaise < 100) {
      return NextResponse.json({ error: 'Minimum transaction value not met.' }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `node_${Date.now()}_${userId.slice(-4)}`,
      notes: {
        userId,
        planId,
        planName: planData.name
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('[RAZORPAY_ORDER_FAILURE]:', error);
    return NextResponse.json({ error: 'Gateway failed to initialize.' }, { status: 500 });
  }
}

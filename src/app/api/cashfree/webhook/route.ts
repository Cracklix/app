
import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Institutional Cashfree Webhook Node.
 * Handles automated registry updates for successful background payments.
 */

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    // 1. Signature Verification
    try {
      Cashfree.PGVerifyWebhookSignature(signature!, rawBody, timestamp!);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid Webhook Signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { data } = payload;
    const order = data.order;
    const payment = data.payment;

    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { firestore: db } = initializeFirebase();
      const userId = order.customer_details.customer_id;
      
      const paymentRef = doc(db, 'payment_requests', payment.cf_payment_id.toString());
      await setDoc(paymentRef, {
        id: payment.cf_payment_id.toString(),
        orderId: order.order_id,
        userId,
        amount: order.order_amount,
        status: 'APPROVED',
        gateway: 'CASHFREE',
        webhook_synced: true,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      // Note: Ideally, the user's pass update should also happen here if not already done by the verify route.
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[CASHFREE_WEBHOOK_FAILURE]:', error);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }
}

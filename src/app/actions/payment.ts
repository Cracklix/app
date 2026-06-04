'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * @fileOverview Secure Payment Server Actions.
 * Handles Razorpay order creation and HMAC-SHA256 signature verification.
 */

const PLANS = {
  silver: { amount: 99, name: 'Silver Pass', tier: 'Silver' },
  gold: { amount: 199, name: 'Gold Pass', tier: 'Gold' },
  premium: { amount: 499, name: 'Elite Pass', tier: 'Premium' },
};

function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });
}

export async function createRazorpayOrder(planId: string) {
  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) throw new Error('Invalid Plan');

  const razorpay = getRazorpayInstance();
  const options = {
    amount: plan.amount * 100, // Razorpay expects paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId,
      planName: plan.name
    };
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    throw new Error('Could not initialize payment with gateway.');
  }
}

export async function verifyRazorpayPayment(data: {
  orderId: string;
  paymentId: string;
  signature: string;
  userId: string;
  userEmail: string;
  planId: string;
}) {
  const { orderId, paymentId, signature, userId, userEmail, planId } = data;
  const plan = PLANS[planId as keyof typeof PLANS];

  // 1. Secure Signature Verification
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (generatedSignature !== signature) {
    throw new Error('Payment verification failed. Untrusted signature.');
  }

  // 2. Database Synchronization
  const { firestore: db } = initializeFirebase();

  try {
    // 3. Atomically Update User Status
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { 
      status: plan.tier, 
      updatedAt: serverTimestamp() 
    }, { merge: true });

    // 4. Record Subscription Registry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await addDoc(collection(db, 'subscriptions'), {
      userId,
      planId,
      planName: plan.name,
      status: 'active',
      startDate: serverTimestamp(),
      expiryDate: expiryDate.toISOString(),
      orderId,
      paymentId
    });

    // 5. Log Verified Transaction
    await addDoc(collection(db, 'payments'), {
      userId,
      userEmail,
      orderId,
      paymentId,
      amount: plan.amount,
      currency: 'INR',
      status: 'success',
      passName: plan.name,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (e) {
    console.error('Firestore Sync Error:', e);
    throw new Error('Payment verified but database update failed.');
  }
}

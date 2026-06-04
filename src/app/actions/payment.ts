
'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  getDoc
} from 'firebase/firestore';

/**
 * @fileOverview Secure Pass Management & Payment Actions.
 * Handles Manual UPI approval and role-based pass grants.
 */

const PLANS = {
  free: { amount: 0, name: 'Aspirant Free', tier: 'Free' },
  silver: { amount: 99, name: 'Silver Pass', tier: 'Silver' },
  gold: { amount: 199, name: 'Gold Pass', tier: 'Gold' },
  premium: { amount: 499, name: 'Elite Pass', tier: 'Premium' },
  platinum: { amount: 999, name: 'Platinum Pass', tier: 'Platinum' },
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
    amount: plan.amount * 100, 
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

export async function submitManualPayment(data: {
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  transactionId: string;
}) {
  const { userId, userEmail, userName, planId, transactionId } = data;
  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) throw new Error('Invalid Plan');

  const { firestore: db } = initializeFirebase();

  try {
    const reqRef = await addDoc(collection(db, 'payment_requests'), {
      userId,
      userEmail,
      userName,
      planId,
      planName: plan.name,
      amount: plan.amount,
      transactionId,
      status: 'PENDING',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, requestId: reqRef.id };
  } catch (e) {
    console.error('Manual Payment Submission Error:', e);
    throw new Error('Failed to submit verification request.');
  }
}

export async function approvePaymentRequest(requestId: string, adminId: string) {
  const { firestore: db } = initializeFirebase();

  try {
    const reqRef = doc(db, 'payment_requests', requestId);
    const snap = await getDoc(reqRef);
    
    if (!snap.exists()) throw new Error('Request not found');
    const data = snap.data();

    // 1. Calculate Expiry (30 Days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // 2. Update User Status & Registry
    const userRef = doc(db, 'users', data.userId);
    await updateDoc(userRef, { 
      status: PLANS[data.planId as keyof typeof PLANS].tier,
      passExpiryDate: expiryDate.toISOString(),
      updatedAt: serverTimestamp()
    });

    // 3. Mark Request as Approved
    await updateDoc(reqRef, {
      status: 'APPROVED',
      approvedBy: adminId,
      updatedAt: serverTimestamp()
    });

    // 4. Create Subscription Record
    await addDoc(collection(db, 'subscriptions'), {
      userId: data.userId,
      planId: data.planId,
      planName: data.planName,
      status: 'active',
      startDate: serverTimestamp(),
      expiryDate: expiryDate.toISOString(),
      verifiedManual: true,
      transactionId: data.transactionId
    });

    return { success: true };
  } catch (e) {
    console.error('Approval Error:', e);
    throw new Error('Failed to approve payment.');
  }
}

/**
 * Grants a specific pass to a user manually (Admin Only)
 */
export async function grantUserPass(userId: string, planId: string, durationDays: number, adminId: string) {
  const { firestore: db } = initializeFirebase();
  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) throw new Error('Invalid Pass Plan');

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: plan.tier,
      passExpiryDate: expiryDate.toISOString(),
      updatedAt: serverTimestamp()
    });

    await addDoc(collection(db, "subscriptions"), {
      userId,
      planId,
      planName: plan.name,
      status: 'active',
      startDate: serverTimestamp(),
      expiryDate: expiryDate.toISOString(),
      grantedBy: adminId,
      type: 'FREE_GRANT'
    });

    return { success: true };
  } catch (e) {
    console.error('Grant Pass Error:', e);
    throw new Error('Could not grant pass to user.');
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

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (generatedSignature !== signature) {
    throw new Error('Payment verification failed. Untrusted signature.');
  }

  const { firestore: db } = initializeFirebase();

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      status: plan.tier, 
      passExpiryDate: expiryDate.toISOString(),
      updatedAt: serverTimestamp() 
    });

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

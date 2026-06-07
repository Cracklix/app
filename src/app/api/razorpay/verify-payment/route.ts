import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Razorpay Signature Verification & Subscription Automation Node.
 * Hardened with crypto signature audit.
 */

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      planId
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    // 1. Verify Signature Integrity
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      console.error('[SECURITY_ALERT]: Invalid Payment Signature Attempt');
      return NextResponse.json({ error: 'Transaction signature mismatch.' }, { status: 400 });
    }

    // 2. Grant Access in Institutional Registry
    const { firestore: db } = initializeFirebase();
    const userRef = doc(db, 'users', userId);
    const planRef = doc(db, 'passes', planId);
    
    const planSnap = await getDoc(planRef);
    if (!planSnap.exists()) throw new Error("Plan node missing in master registry.");
    const planData = planSnap.data();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (planData.durationDays || 30));

    // Update Student Registry
    await updateDoc(userRef, {
      status: planId,
      passExpiryDate: expiryDate.toISOString(),
      updatedAt: serverTimestamp()
    });

    // Create Subscription Audit Hub Entry
    await addDoc(collection(db, 'subscriptions'), {
      userId,
      planId,
      planName: planData.name,
      status: 'active',
      startDate: serverTimestamp(),
      expiryDate: expiryDate.toISOString(),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: planData.price,
      gateway: 'RAZORPAY_WEB',
      verified: true,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Verification node failure.' }, { status: 500 });
  }
}

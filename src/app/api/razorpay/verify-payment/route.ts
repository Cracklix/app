
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Razorpay Signature Verification & Subscription Automation Node.
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
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // 1. Verify Signature Integrity
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
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

    // Create Financial Node Entry
    await addDoc(collection(db, 'payments'), {
      userId,
      userEmail: (await getDoc(userRef)).data()?.email || 'N/A',
      planId,
      planName: planData.name,
      amount: planData.price,
      paymentId: razorpay_payment_id,
      status: 'SUCCESS',
      createdAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Verification node failure.' }, { status: 500 });
  }
}

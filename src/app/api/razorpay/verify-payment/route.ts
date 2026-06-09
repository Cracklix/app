
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Hardened Payment Signature Verification.
 * Performs HMAC-SHA256 audit and synchronizes institutional registry.
 */

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      planId
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    // 1. Cryptographic Audit (HMAC-SHA256)
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Security Compromised: Signature Mismatch' }, { status: 400 });
    }

    const { firestore: db } = initializeFirebase();

    // 2. Fetch Plan Metadata for Expiry Calculation
    const planSnap = await getDoc(doc(db, "passes", planId));
    const planData = planSnap?.data();
    
    if (!planData) {
      return NextResponse.json({ error: 'Registry Sync Error: Plan Missing' }, { status: 404 });
    }

    // 3. Institutional Registry Upgrade (Elite Pass Activation)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (planData.durationDays || 30));

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      pass: {
        active: true,
        plan: planData.id?.toUpperCase() || 'PREMIUM',
        purchaseDate: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        freePassClaimed: false
      },
      status: planData.id,
      updatedAt: serverTimestamp()
    });

    // 4. Ledger Entry
    const paymentRef = doc(db, 'payment_requests', razorpay_payment_id);
    await setDoc(paymentRef, {
      id: razorpay_payment_id,
      orderId: razorpay_order_id,
      userId,
      planId,
      planName: planData.name,
      amount: planData.price,
      status: 'APPROVED',
      gateway: 'RAZORPAY',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[RAZORPAY_VERIFY_FAILURE]:', error);
    return NextResponse.json({ error: 'Registry synchronization failed.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { initializeFirebase } from '@/firebase/app';
import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Hardened Testbook-Style Verification Hub v6.0.
 * LOGIC: Same plan = extension, Higher tier = upgrade.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, userId, planId } = body;
    
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Gateway configuration error.' }, { status: 500 });
    }

    Cashfree.XClientId = clientId;
    Cashfree.XClientSecret = clientSecret;
    const isProd = clientSecret.startsWith('cf_prod_');
    Cashfree.XEnvironment = isProd ? Cashfree.Environment.PRODUCTION : Cashfree.Environment.SANDBOX;

    if (!order_id || !userId || !planId) {
      return NextResponse.json({ error: 'Audit parameters missing.' }, { status: 400 });
    }

    // 1. Fetch Gateway Result
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", order_id);
    const payments = response.data;
    const successNode = payments?.find(p => p.payment_status === 'SUCCESS');

    if (!successNode) {
      return NextResponse.json({ error: 'Transaction not found or failed.' }, { status: 400 });
    }

    // 2. Fetch Registry Context
    const { firestore: db } = initializeFirebase();
    const userRef = doc(db, 'users', userId);
    const planRef = doc(db, 'passes', planId);
    
    const [userSnap, planSnap] = await Promise.all([getDoc(userRef), getDoc(planRef)]);
    
    if (!planSnap.exists()) return NextResponse.json({ error: 'Pass node missing.' }, { status: 404 });
    const planData = planSnap.data();
    const userData = userSnap.data() || {};

    const now = new Date();
    const duration = Number(planData.durationDays) || 30;
    const currentExpiry = userData.passExpiresAt ? new Date(userData.passExpiresAt) : null;
    const isPassActive = currentExpiry && currentExpiry > now;
    
    let finalExpiry: Date;

    if (isPassActive && userData.status === planId) {
      // SAME PLAN: EXTEND
      finalExpiry = new Date(currentExpiry.getTime());
      finalExpiry.setDate(finalExpiry.getDate() + duration);
    } else {
      // UPGRADE OR FRESH: START NOW
      finalExpiry = new Date();
      finalExpiry.setDate(now.getDate() + duration);
    }

    // 3. Commit Subscription
    await updateDoc(userRef, {
      pass: {
        active: true,
        plan: planData.id?.toUpperCase() || 'ELITE',
        purchaseDate: now.toISOString(),
        expiryDate: finalExpiry.toISOString(),
        freePassClaimed: planData.id === 'free-pass'
      },
      passStatus: 'active',
      passActivatedAt: now.toISOString(),
      passExpiresAt: finalExpiry.toISOString(),
      status: planData.id,
      planTier: planData.tier || 1,
      updatedAt: serverTimestamp()
    });

    // 4. Record Transaction
    await setDoc(doc(db, 'payment_requests', successNode.cf_payment_id!.toString()), {
      id: successNode.cf_payment_id!.toString(),
      orderId: order_id,
      userId,
      planId,
      planName: planData.name,
      amount: Number(planData.price),
      status: 'APPROVED',
      gateway: 'CASHFREE',
      method: successNode.payment_group || 'UNKNOWN',
      verifiedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });

    return NextResponse.json({ success: true, expiry: finalExpiry.toISOString() });

  } catch (error: any) {
    console.error("[CASHFREE_VERIFY_FAILURE]:", error);
    return NextResponse.json({ error: 'Synchronization failed.' }, { status: 500 });
  }
}

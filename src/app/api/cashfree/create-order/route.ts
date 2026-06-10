
import { NextResponse } from 'next/server';
import { Cashfree } from 'cashfree-pg';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview Hardened Production Order Node v4.0.
 * UPDATED: Dynamic origin handling with protocol enforcement.
 */

const clientId = process.env.CASHFREE_CLIENT_ID;
const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
const env = process.env.CASHFREE_ENV || 'production';

// Initialize SDK with Production/Sandbox detection
Cashfree.XClientId = clientId!;
Cashfree.XClientSecret = clientSecret!;
Cashfree.XEnvironment = (env === 'production' || clientSecret?.includes('_prod_')) 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const { planId, userId, origin } = await req.json();
    const { firestore: db } = initializeFirebase();

    if (!userId || !planId) {
      return NextResponse.json({ error: 'Mandatory session data missing.' }, { status: 400 });
    }

    const planSnap = await getDoc(doc(db, "passes", planId));
    if (!planSnap.exists()) {
      return NextResponse.json({ error: 'Pass node missing from registry.' }, { status: 404 });
    }
    const planData = planSnap.data();
    const amount = Number(planData.price);

    if (amount <= 0) {
      return NextResponse.json({ error: 'Direct order creation for ₹0 nodes is prohibited.' }, { status: 400 });
    }

    const userSnap = await getDoc(doc(db, "users", userId));
    const userData = userSnap.data();

    // DYNAMIC DOMAIN ANCHORING
    // Strictly prioritize NEXT_PUBLIC_SITE_URL for return path to maintain production stability
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || new URL(req.url).origin;
    const baseOrigin = siteUrl.replace('http://', 'https://');
    const orderId = `order_${Date.now()}_${userId.slice(-4)}`;

    const request = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: userId,
        customer_name: userData?.name || "Aspirant",
        customer_email: userData?.email || "student@cracklix.com",
        customer_phone: userData?.phone?.replace(/\D/g, '').slice(-10) || "9999999999",
      },
      order_meta: {
        return_url: `${baseOrigin}/payment/success?order_id={order_id}&plan=${encodeURIComponent(planData.name)}`,
        notify_url: `${baseOrigin}/api/cashfree/webhook`
      },
      order_note: `Institutional Pass: ${planData.name}`,
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
      cf_order_id: response.data.cf_order_id,
      environment: env
    });
  } catch (error: any) {
    const errData = error?.response?.data || error;
    console.error('[CASHFREE_ORDER_FAILURE]:', errData);
    return NextResponse.json({ 
      error: errData.message || 'Transaction node initialization failed.',
      details: errData
    }, { status: 500 });
  }
}

// app/api/cashfree/route.ts  ← NAYA FILE BANAO (payu wala reh sakta hai)
import { NextRequest, NextResponse } from "next/server";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_ENV = process.env.CASHFREE_ENV || "production";

const BASE_URL = CASHFREE_ENV === "production"
  ? "https://api.cashfree.com/pg/orders"
  : "https://sandbox.cashfree.com/pg/orders";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { promptSlug, promptName, price } = body;

  const orderId = `NP_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.noxzone111.online";

  const orderData = {
    order_id: orderId,
    order_amount: parseFloat(price),
    order_currency: "INR",
    customer_details: {
      customer_id: `cust_${Date.now()}`,
      customer_name: "User",
      customer_email: "user@noxprompts.com",
      customer_phone: "9999999999",
    },
    order_meta: {
      return_url: `${siteUrl}/checkout/success?txnid=${orderId}&slug=${promptSlug}&order_id={order_id}&order_token={order_token}`,
      notify_url: `${siteUrl}/api/cashfree/webhook`,
    },
    order_note: `NoxPrompts - ${promptName}`,
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Cashfree error:", data);
    return NextResponse.json({ error: "Payment init failed", details: data }, { status: 500 });
  }

  // Return payment session URL for redirect
  return NextResponse.json({
    paymentUrl: data.payment_link || `https://payments.cashfree.com/forms/${data.payment_session_id}`,
    orderId: data.order_id,
    sessionId: data.payment_session_id,
  });
}

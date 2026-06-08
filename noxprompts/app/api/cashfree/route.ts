import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || "1299432dc1ed72a83e8ecaa27d52349921";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_prod_e6a76b3938304ee21e2bb216398948a7_b5808833";
const BASE_URL = "https://api.cashfree.com/pg/orders";

export async function POST(req: NextRequest) {
  try {
    const { promptSlug, promptName, price } = await req.json();

    const orderId = `NP_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const orderData = {
      order_id: orderId,
      order_amount: price || 9,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: "NoxPrompts User",
        customer_email: "user@noxprompts.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: `https://www.noxzone111.online/checkout/success?order_id={order_id}&slug=${promptSlug}`,
        notify_url: `https://www.noxzone111.online/api/cashfree/webhook`,
      },
      order_note: `Unlock: ${promptName}`,
    };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    console.log("Cashfree response:", JSON.stringify(data));

    if (!response.ok || data.message) {
      return NextResponse.json({ error: data.message || "Order creation failed" }, { status: 400 });
    }

    return NextResponse.json({ sessionId: data.payment_session_id });
  } catch (err) {
    console.error("Cashfree error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

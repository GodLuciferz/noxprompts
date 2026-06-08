import { NextRequest, NextResponse } from "next/server";

const CASHFREE_APP_ID = "TEST11094628769e0070cbf5fa23671782649011";
const CASHFREE_SECRET_KEY = "cfsk_ma_test_916a64f320b6f8023f15a295fd294ed5_4bd6dfdc";
const BASE_URL = "https://sandbox.cashfree.com/pg/orders";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { promptSlug, promptName, price } = body;

  const orderId = `NP${Date.now()}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.noxzone111.online";

  const orderData = {
    order_id: orderId,
    order_amount: parseFloat(price),
    order_currency: "INR",
    customer_details: {
      customer_id: `cust${Date.now()}`,
      customer_name: "Test User",
      customer_email: "test@noxprompts.com",
      customer_phone: "9999999999",
    },
    order_meta: {
      return_url: `${siteUrl}/checkout/success?txnid=${orderId}&slug=${promptSlug}`,
      notify_url: `${siteUrl}/api/cashfree/webhook`,
    },
    order_note: `NoxPrompts - ${promptName}`,
  };

  try {
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
    console.log("Cashfree response:", JSON.stringify(data));

    if (!res.ok || data.type === "ERROR") {
      return NextResponse.json({ error: data.message || "Payment init failed" }, { status: 500 });
    }

    return NextResponse.json({
      sessionId: data.payment_session_id,
      orderId: data.order_id,
    });

  } catch (err) {
    console.error("Cashfree fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

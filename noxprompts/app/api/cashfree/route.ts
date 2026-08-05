import { NextRequest, NextResponse } from "next/server";
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const BASE_URL = "https://api.cashfree.com/pg/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;
    let orderId: string;
    let amount: number;
    let orderNote: string;
    let returnUrl: string;
    if (type === "smm") {
      const { serviceId, serviceName, quantity, link, price } = body;
      orderId = `SMM${Date.now()}`;
      amount = parseFloat(price);
      orderNote = `SMM: ${serviceName} x${quantity}`;
      returnUrl = `https://www.noxzone111.online/smm/success?oid={order_id}&sid=${serviceId}&qty=${quantity}&lnk=${encodeURIComponent(link)}&amt=${amount}`;
    } else {
      const { promptSlug, promptName, price } = body;
      orderId = `NP${Date.now()}`;
      amount = parseFloat(price) || 9;
      orderNote = `Unlock: ${promptName}`;
      returnUrl = `https://www.noxzone111.online/checkout/success?order_id={order_id}&slug=${promptSlug}`;
    }
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust${Date.now()}`,
        customer_name: "NoxZone User",
        customer_email: "user@noxzone111.online",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: returnUrl,
      },
      order_note: orderNote,
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
    if (!response.ok || data.message) {
      return NextResponse.json({ error: data.message || "Order creation failed" }, { status: 400 });
    }
    return NextResponse.json({ sessionId: data.payment_session_id, orderId });
  } catch (err) {
    console.error("Cashfree error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

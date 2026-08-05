import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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
      returnUrl = `https://www.noxzone111.online/smm/success?oid=${orderId}&sid=${serviceId}&qty=${quantity}&lnk=${encodeURIComponent(link)}&amt=${amount}`;
    } else {
      const { promptSlug, promptName, price } = body;
      orderId = `NP${Date.now()}`;
      amount = parseFloat(price) || 9;
      orderNote = `Unlock: ${promptName}`;
      returnUrl = `https://www.noxzone111.online/checkout/success?order_id=${orderId}&slug=${promptSlug}`;
    }

    // Razorpay amount is in paise, and receipt max length is 40 chars
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderId,
      notes: {
        order_note: orderNote,
        return_url: returnUrl,
      },
    });

    return NextResponse.json({
      orderId: order.id,       // Razorpay's own order id (order_xxxxx) — use this for verify
      internalOrderId: orderId, // your own generated id, kept for reference
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this to open checkout
      returnUrl,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

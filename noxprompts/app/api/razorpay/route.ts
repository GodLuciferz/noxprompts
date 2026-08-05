import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Removes emojis/special unicode chars — keeps only safe ASCII printable characters
function sanitize(str: string): string {
  return str
    .replace(/[^\x20-\x7E]/g, "") // strip anything outside basic ASCII printable range
    .trim()
    .slice(0, 250); // Razorpay notes value max length safety
}

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
      orderNote = sanitize(`SMM: ${serviceName} x${quantity}`);
      returnUrl = `https://www.noxzone111.online/smm/success?oid=${orderId}&sid=${serviceId}&qty=${quantity}&lnk=${encodeURIComponent(link)}&amt=${amount}`;
    } else {
      const { promptSlug, promptName, price } = body;
      orderId = `NP${Date.now()}`;
      amount = parseFloat(price) || 9;
      orderNote = sanitize(`Unlock: ${promptName}`);
      returnUrl = `https://www.noxzone111.online/checkout/success?order_id=${orderId}&slug=${promptSlug}`;
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: orderId,
      notes: {
        order_note: orderNote,
        return_url: sanitize(returnUrl),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      internalOrderId: orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      returnUrl,
    });
  } catch (err: any) {
    console.error("Razorpay order error:", err?.error || err);
    return NextResponse.json({ error: err?.error?.description || "Server error" }, { status: 500 });
  }
}

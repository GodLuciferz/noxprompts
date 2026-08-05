import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ paid: false, error: "Missing params" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const paid = expectedSignature === razorpay_signature;

    return NextResponse.json({ paid, orderId: razorpay_order_id, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ paid: false, error: "Verification failed" }, { status: 500 });
  }
}

// Optional: agar polling wala GET bhi chahiye (order status check by order_id)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ paid: false, error: "Missing order_id" }, { status: 400 });
  }

  try {
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const res = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    const data = await res.json();
    const paid = data.status === "paid";
    return NextResponse.json({ paid, status: data.status, amount: data.amount });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ paid: false, error: "Verification failed" }, { status: 500 });
  }
}

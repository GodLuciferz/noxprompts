import { NextRequest, NextResponse } from "next/server";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ paid: false, error: "Missing order_id" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
    });

    const data = await res.json();
    const paid = data.order_status === "PAID";
    return NextResponse.json({ paid, status: data.order_status, amount: data.order_amount });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ paid: false, error: "Verification failed" }, { status: 500 });
  }
}

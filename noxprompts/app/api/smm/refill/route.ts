import { NextRequest, NextResponse } from 'next/server';

const EASYSMM_API_URL = 'https://easysmmpanel.com/api/v2';
const EASYSMM_API_KEY = process.env.EASYSMM_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const res = await fetch(EASYSMM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key: EASYSMM_API_KEY, action: 'refill', order: String(orderId) }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Refill failed' }, { status: 500 });
  }
}

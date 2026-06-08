import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://easysmmpanel.com/api/v2';
const API_KEY = process.env.EASYSMM_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { service, link, quantity } = await req.json();

    if (!service || !link || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        key: API_KEY,
        action: 'add',
        service: String(service),
        link,
        quantity: String(quantity),
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json({ error: 'Order failed' }, { status: 500 });
  }
}

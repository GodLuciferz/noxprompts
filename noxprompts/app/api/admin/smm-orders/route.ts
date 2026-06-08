import { NextRequest, NextResponse } from 'next/server';

const EASYSMM_API_URL = 'https://easysmmpanel.com/api/v2';
const EASYSMM_API_KEY = process.env.EASYSMM_API_KEY!;
const ADMIN_PASS = '@noxstudio123';

export async function GET(req: NextRequest) {
  const pass = req.headers.get('x-admin-password');
  if (pass !== ADMIN_PASS) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const balRes = await fetch(EASYSMM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key: EASYSMM_API_KEY, action: 'balance' }),
    });
    const balData = await balRes.json();
    return NextResponse.json({ balance: balData.balance || '0', currency: balData.currency || 'INR' });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

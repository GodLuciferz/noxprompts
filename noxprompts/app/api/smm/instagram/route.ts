import { NextResponse } from 'next/server';

const API_URL = 'https://easysmmpanel.com/api/v2';
const API_KEY = process.env.EASYSMM_API_KEY || '';

export const revalidate = 300; // cache 5 min

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key: API_KEY, action: 'services' }),
      next: { revalidate: 300 },
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid API response' }, { status: 502 });
    }

    // Filter only Instagram services
    const instagram = data.filter((s: { name: string }) =>
      s.name.toLowerCase().includes('instagram') ||
      s.name.toLowerCase().includes('ig ')
    );

    return NextResponse.json(instagram);
  } catch (err) {
    console.error('EasySMM fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAllTrends } from '@/lib/db';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  headers();
  try {
    const trends = await getAllTrends();
    return NextResponse.json(trends, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

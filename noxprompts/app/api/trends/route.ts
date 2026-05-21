import { NextResponse } from 'next/server';
import { getAllTrends } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const trends = await getAllTrends();
    return NextResponse.json(trends, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET trends error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

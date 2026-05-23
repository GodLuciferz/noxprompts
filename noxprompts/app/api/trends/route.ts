import { NextResponse } from 'next/server';
import { getAllTrends } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const trends = await getAllTrends();
  return NextResponse.json(trends, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

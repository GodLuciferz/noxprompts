import { NextResponse } from 'next/server';
import { getAllTrends } from '@/lib/db';

export async function GET() {
  const trends = await getAllTrends();
  return NextResponse.json(trends);
}

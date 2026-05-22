import { NextResponse } from 'next/server';
import { getAllTrends } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('NETLIFY_SITE_ID:', process.env.NETLIFY_SITE_ID);
    console.log('NETLIFY_TOKEN exists:', !!process.env.NETLIFY_TOKEN);
    const trends = await getAllTrends();
    console.log('Trends count:', trends.length);
    return NextResponse.json(trends, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET trends error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

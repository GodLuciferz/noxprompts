import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json([{ test: true, message: "Route is working" }], {
    headers: { 'Cache-Control': 'no-store' },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { incrementCopyCount } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await incrementCopyCount(params.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

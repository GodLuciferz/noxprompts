import { NextRequest, NextResponse } from 'next/server';
import { incrementCopyCount } from '@/lib/db';

export async function POST(_: NextRequest, { params }: { params: { slug: string } }) {
  await incrementCopyCount(params.slug);
  return NextResponse.json({ ok: true });
}

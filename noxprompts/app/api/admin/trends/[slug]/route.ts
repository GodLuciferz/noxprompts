import { NextRequest, NextResponse } from 'next/server';
import { deleteTrend } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await deleteTrend(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

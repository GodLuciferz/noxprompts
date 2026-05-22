import { NextRequest, NextResponse } from 'next/server';
import { saveTrend, deleteTrend, getTrendBySlug } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import { v4 as uuid } from 'crypto';

function auth(req: NextRequest) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const slug = generateSlug(body.title);
  const trend = {
    id: `${Date.now()}`,
    slug,
    title: body.title,
    category: body.category,
    tags: body.tags || [],
    imageUrl: body.imageUrl,
    prompt: body.prompt,
    description: body.description,
    isTrending: body.isTrending || false,
    copyCount: 0,
    createdAt: new Date().toISOString(),
  };

  await saveTrend(trend);
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await req.json();
  await deleteTrend(slug);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const existing = await getTrendBySlug(body.slug);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await saveTrend({ ...existing, ...body });
  return NextResponse.json({ ok: true });
}

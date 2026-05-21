import { NextRequest, NextResponse } from 'next/server';
import { saveTrend, getTrendBySlug, deleteTrend, Trend } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean);
    const prompt = formData.get('prompt') as string;
    const description = formData.get('description') as string;
    const isTrending = formData.get('isTrending') === 'true';
    const existingSlug = formData.get('existingSlug') as string | null;
    const existingImageUrl = formData.get('existingImageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!title || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = existingSlug || slugify(title);
    let imageUrl = existingImageUrl || '';

    // Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await uploadImage(buffer, slug);
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 });
    }

    // Get existing trend data if editing
    let existingTrend: Trend | null = null;
    if (existingSlug) {
      existingTrend = await getTrendBySlug(existingSlug);
    }

    const trend: Trend = {
      id: existingTrend?.id || crypto.randomUUID(),
      slug,
      title,
      category,
      tags,
      imageUrl,
      prompt,
      description,
      isTrending,
      copyCount: existingTrend?.copyCount || 0,
      createdAt: existingTrend?.createdAt || new Date().toISOString(),
    };

    // If title changed, delete old slug and save with new
    if (existingSlug && existingSlug !== slug) {
      await deleteTrend(existingSlug);
    }

    await saveTrend(trend);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

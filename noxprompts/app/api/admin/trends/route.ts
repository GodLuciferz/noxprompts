import { NextRequest, NextResponse } from 'next/server';
import { saveTrend, Trend } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tags = (formData.get('tags') as string)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const prompt = formData.get('prompt') as string;
    const description = formData.get('description') as string;
    const isTrending = formData.get('isTrending') === 'true';
    const imageFile = formData.get('image') as File;

    if (!title || !prompt || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const slug = slugify(title);
    const imageUrl = await uploadImage(buffer, slug);

    const trend: Trend = {
      id: crypto.randomUUID(),
      slug,
      title,
      category,
      tags,
      imageUrl,
      prompt,
      description,
      isTrending,
      copyCount: 0,
      createdAt: new Date().toISOString(),
    };

    await saveTrend(trend);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

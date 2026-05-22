import { kv } from '@vercel/kv';

export interface Trend {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
  prompt: string;
  description: string;
  isTrending: boolean;
  copyCount: number;
  createdAt: string;
}

export async function getAllTrends(): Promise<Trend[]> {
  try {
    const keys = await kv.smembers('trend:keys');
    if (!keys || keys.length === 0) return [];
    const trends = await Promise.all(keys.map((k) => kv.get<Trend>(`trend:${k}`)));
    return (trends.filter(Boolean) as Trend[]).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function getTrendBySlug(slug: string): Promise<Trend | null> {
  try {
    return await kv.get<Trend>(`trend:${slug}`);
  } catch {
    return null;
  }
}

export async function saveTrend(trend: Trend): Promise<void> {
  await kv.set(`trend:${trend.slug}`, trend);
  await kv.sadd('trend:keys', trend.slug);
}

export async function deleteTrend(slug: string): Promise<void> {
  await kv.del(`trend:${slug}`);
  await kv.srem('trend:keys', slug);
}

export async function incrementCopyCount(slug: string): Promise<void> {
  try {
    const trend = await kv.get<Trend>(`trend:${slug}`);
    if (trend) {
      trend.copyCount = (trend.copyCount || 0) + 1;
      await kv.set(`trend:${slug}`, trend);
    }
  } catch {}
}

export const CATEGORIES = [
  'All','Anime','Ghibli','Realistic','Dark','Cute',
  'Neon','Fantasy','Vintage','Minimalist','Sci-Fi','Nature',
];

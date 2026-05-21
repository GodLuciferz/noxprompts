import { getStore } from '@netlify/blobs';

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

function getStoreInstance() {
  return getStore({
    name: 'trends',
    consistency: 'strong',
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_TOKEN,
  });
}

export async function getAllTrends(): Promise<Trend[]> {
  try {
    const store = getStoreInstance();
    const { blobs } = await store.list();
    const trends: Trend[] = [];

    for (const blob of blobs) {
      try {
        const data = await store.get(blob.key, { type: 'json' });
        if (data) trends.push(data as Trend);
      } catch {}
    }

    return trends.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (e) {
    console.error('getAllTrends error:', e);
    return [];
  }
}

export async function getTrendBySlug(slug: string): Promise<Trend | null> {
  try {
    const store = getStoreInstance();
    const data = await store.get(slug, { type: 'json' });
    return data as Trend | null;
  } catch {
    return null;
  }
}

export async function saveTrend(trend: Trend): Promise<void> {
  const store = getStoreInstance();
  await store.setJSON(trend.slug, trend);
}

export async function deleteTrend(slug: string): Promise<void> {
  const store = getStoreInstance();
  await store.delete(slug);
}

export async function incrementCopyCount(slug: string): Promise<void> {
  try {
    const store = getStoreInstance();
    const trend = (await store.get(slug, { type: 'json' })) as Trend | null;
    if (trend) {
      trend.copyCount = (trend.copyCount || 0) + 1;
      await store.setJSON(slug, trend);
    }
  } catch {}
}

export const CATEGORIES = [
  'All', 'Anime', 'Ghibli', 'Realistic', 'Dark', 'Cute',
  'Neon', 'Fantasy', 'Vintage', 'Minimalist', 'Sci-Fi', 'Nature'
];

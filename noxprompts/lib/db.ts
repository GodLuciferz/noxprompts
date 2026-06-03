import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  isPaid?: boolean;
  price?: number;
  copyCount: number;
  createdAt: string;
}

export interface SiteLink {
  label: string;
  url: string;
  icon?: string;
}

export interface SiteInfo {
  title: string;
  description: string;
  links: SiteLink[];
}

function toTrend(row: any): Trend {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    tags: row.tags || [],
    imageUrl: row.image_url,
    prompt: row.prompt,
    description: row.description,
    isTrending: row.is_trending,
    copyCount: row.copy_count,
    createdAt: row.created_at,
  };
}

export async function getAllTrends(): Promise<Trend[]> {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getAllTrends error:', error); return []; }
    return (data || []).map(toTrend);
  } catch (e) {
    console.error('getAllTrends exception:', e);
    return [];
  }
}

export async function getTrendBySlug(slug: string): Promise<Trend | null> {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error || !data) return null;
    return toTrend(data);
  } catch { return null; }
}

export async function getRelatedTrends(slug: string, category: string): Promise<Trend[]> {
  try {
    const { data } = await supabase
      .from('trends')
      .select('*')
      .eq('category', category)
      .neq('slug', slug)
      .limit(3);
    return (data || []).map(toTrend);
  } catch { return []; }
}

export async function saveTrend(trend: Trend): Promise<void> {
  const { error } = await supabase.from('trends').upsert({
    id: trend.id,
    slug: trend.slug,
    title: trend.title,
    category: trend.category,
    tags: trend.tags,
    image_url: trend.imageUrl,
    prompt: trend.prompt,
    description: trend.description,
    is_trending: trend.isTrending,
    copy_count: trend.copyCount,
    created_at: trend.createdAt,
  });
  if (error) console.error('saveTrend error:', error);
}

export async function deleteTrend(slug: string): Promise<void> {
  await supabase.from('trends').delete().eq('slug', slug);
}

export async function incrementCopyCount(slug: string): Promise<void> {
  try {
    const { data } = await supabase
      .from('trends')
      .select('copy_count')
      .eq('slug', slug)
      .single();
    if (data) {
      await supabase
        .from('trends')
        .update({ copy_count: (data.copy_count || 0) + 1 })
        .eq('slug', slug);
    }
  } catch {}
}

export const CATEGORIES = [
  'All','Anime','Ghibli','Realistic','Dark','Cute',
  'Neon','Fantasy','Vintage','Minimalist','Sci-Fi','Nature',
];

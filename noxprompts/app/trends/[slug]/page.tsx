import { getTrendBySlug, getAllTrends } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TrendPageClient from '@/components/TrendPageClient';

export const revalidate = 60;

export async function generateStaticParams() {
  const trends = await getAllTrends();
  return trends.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trend = await getTrendBySlug(params.slug);
  if (!trend) return {};
  return {
    title: `${trend.title} — AI Art Prompt | NoxPrompts`,
    description: trend.description,
    keywords: `${trend.title}, AI art prompt, ${trend.tags.join(', ')}, ${trend.category}`,
    openGraph: {
      title: `${trend.title} — AI Art Prompt`,
      description: trend.description,
      images: [{ url: trend.imageUrl, width: 1200, height: 800, alt: trend.title }],
      url: `https://noxzone111.online/trends/${trend.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${trend.title} — AI Art Prompt`,
      description: trend.description,
      images: [trend.imageUrl],
    },
  };
}

export default async function TrendPage({ params }: { params: { slug: string } }) {
  const trend = await getTrendBySlug(params.slug);
  if (!trend) notFound();
  return <TrendPageClient trend={trend} />;
}

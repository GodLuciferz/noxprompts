import { getTrendBySlug, getAllTrends } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TrendDetailClient from '@/components/TrendDetailClient';

export async function generateStaticParams() {
  const trends = await getAllTrends();
  return trends.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const trend = await getTrendBySlug(params.slug);
  if (!trend) return {};
  return {
    title: `${trend.title} — NoxPrompts`,
    description: trend.description,
    openGraph: {
      title: `${trend.title} — NoxPrompts`,
      description: trend.description,
      images: [{ url: trend.imageUrl, width: 1200, height: 800 }],
      url: `https://noxzone111.online/trends/${trend.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${trend.title} — NoxPrompts`,
      description: trend.description,
      images: [trend.imageUrl],
    },
  };
}

export const revalidate = 60;

export default async function TrendPage({ params }: { params: { slug: string } }) {
  const trend = await getTrendBySlug(params.slug);
  if (!trend) notFound();
  return <TrendDetailClient trend={trend} />;
}

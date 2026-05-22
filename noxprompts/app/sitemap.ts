import { getAllTrends } from '@/lib/db';

export default async function sitemap() {
  const trends = await getAllTrends();
  const baseUrl = 'https://noxzone111.online';

  const trendPages = trends.map((trend) => ({
    url: `${baseUrl}/trends/${trend.slug}`,
    lastModified: new Date(trend.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...trendPages,
  ];
}

import { getAllTrends, CATEGORIES } from '@/lib/db';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const allTrends = await getAllTrends();

  return <HomeClient allTrends={allTrends} searchParams={searchParams} categories={CATEGORIES} />;
}

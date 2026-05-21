import { getAllTrends } from '@/lib/db';
import ManageClient from '@/components/ManageClient';

export const dynamic = 'force-dynamic';

export default async function ManagePage() {
  const trends = await getAllTrends();
  return <ManageClient initialTrends={trends} />;
}

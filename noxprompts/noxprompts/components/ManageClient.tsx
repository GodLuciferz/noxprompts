'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Trend } from '@/lib/db';
import { FiTrash2, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ManageClient({ initialTrends }: { initialTrends: Trend[] }) {
  const [trends, setTrends] = useState(initialTrends);
  const router = useRouter();

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/trends/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Deleted! ✅');
      setTrends(trends.filter(t => t.slug !== slug));
    } catch {
      toast.error('Delete failed!');
    }
  };

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}
          >
            <FiArrowLeft size={14} /> Back to Admin
          </button>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '20px', fontWeight: 900 }}>
            <span className="gradient-text">📋 Manage Trends ({trends.length})</span>
          </h1>
        </div>

        {trends.length === 0 ? (
          <div className="nox-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No trends yet! 🎨
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {trends.map((trend) => (
              <div key={trend.id} className="nox-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                  <Image src={trend.imageUrl} alt={trend.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trend.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{trend.category}</span>
                    <span>·</span>
                    <span>{trend.copyCount || 0} copies</span>
                    {trend.isTrending && <span>· 🔥 Trending</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(trend.slug, trend.title)}
                  style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', color: 'var(--nox-pink)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

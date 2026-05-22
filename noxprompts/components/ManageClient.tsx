'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Trend } from '@/lib/db';
import { FiTrash2, FiEdit2, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ManageClient({ initialTrends }: { initialTrends: Trend[] }) {
  const [trends, setTrends] = useState(initialTrends);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trends?t=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      setTrends(Array.isArray(data) ? data : []);
      toast.success('Refreshed!');
    } catch {
      toast.error('Could not refresh');
    }
    setLoading(false);
  };

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

  const handleEdit = (slug: string) => {
    router.push(`/admin?edit=${slug}`);
  };

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px' }}
          >
            <FiArrowLeft size={14} /> Back to Admin
          </button>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '20px', fontWeight: 900, flex: 1 }}>
            <span className="gradient-text">📋 Manage Trends ({trends.length})</span>
          </h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '8px 14px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', opacity: loading ? 0.6 : 1 }}
          >
            <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* List */}
        {trends.length === 0 ? (
          <div className="nox-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No trends yet! 🎨
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {trends.map((trend) => (
              <div key={trend.id} className="nox-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>

                {/* Thumbnail */}
                <div style={{ position: 'relative', width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                  <Image src={trend.imageUrl} alt={trend.title} fill style={{ objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trend.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>{trend.category}</span>
                    <span>·</span>
                    <span>{trend.copyCount || 0} copies</span>
                    {trend.isTrending && <span style={{ color: '#FF6B00' }}>· 🔥 Trending</span>}
                  </div>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => handleEdit(trend.slug)}
                  title="Edit"
                  style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', color: '#00C8FF', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                  <FiEdit2 size={15} />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(trend.slug, trend.title)}
                  title="Delete"
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

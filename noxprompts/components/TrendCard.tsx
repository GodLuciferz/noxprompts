'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trend } from '@/lib/db';
import { FiCopy, FiShare2 } from 'react-icons/fi';

export default function TrendCard({ trend }: { trend: Trend }) {
  const share = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/trends/${trend.slug}`;
    const text = `✨ ${trend.title} — AI Art Prompt\n${url}`;
    if (navigator.share) {
      navigator.share({ title: trend.title, text, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <Link href={`/trends/${trend.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          <Image src={trend.imageUrl} alt={trend.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
          {trend.isTrending && (
            <span className="hot-badge" style={{ position: 'absolute', top: 10, left: 10 }}>🔥 Trending</span>
          )}
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 50,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>{trend.category}</span>
        </div>

        <div style={{ padding: '14px 16px' }}>
          <h3 style={{
            fontFamily: 'Unbounded,sans-serif', fontSize: 14, fontWeight: 700,
            color: 'var(--text)', marginBottom: 8, lineHeight: 1.4,
          }}>{trend.title}</h3>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {trend.tags.slice(0, 3).map(t => (
              <span key={t} style={{
                background: 'rgba(139,47,201,0.1)', color: 'var(--purple)',
                border: '1px solid rgba(139,47,201,0.2)',
                fontSize: 11, padding: '2px 9px', borderRadius: 50, fontWeight: 600,
              }}>#{t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiCopy size={11} /> {trend.copyCount || 0} copies
            </span>
            <button onClick={share} style={{
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-muted)', padding: '4px 12px', borderRadius: 50,
              fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'inherit',
            }}>
              <FiShare2 size={11} /> Share
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

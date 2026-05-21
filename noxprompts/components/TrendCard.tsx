'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trend } from '@/lib/db';
import { FiCopy, FiShare2 } from 'react-icons/fi';

export default function TrendCard({ trend }: { trend: Trend }) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/trends/${trend.slug}`;
    const text = `🔥 Check out this AI art trend: ${trend.title}\n${url}`;
    if (navigator.share) {
      navigator.share({ title: trend.title, text, url });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        '_blank'
      );
    }
  };

  return (
    <Link href={`/trends/${trend.slug}`} style={{ textDecoration: 'none' }}>
      <div className="nox-card" style={{ cursor: 'pointer' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          <Image
            src={trend.imageUrl}
            alt={trend.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* Overlay badges */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
            {trend.isTrending && (
              <span className="trending-badge">🔥 Trending</span>
            )}
          </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {trend.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <h3
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '8px',
            }}
          >
            {trend.title}
          </h3>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {trend.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiCopy size={12} /> {trend.copyCount || 0} copies
            </span>
            <button
              onClick={handleShare}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '50px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              <FiShare2 size={12} /> Share
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

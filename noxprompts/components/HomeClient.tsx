'use client';
import { useState, useMemo } from 'react';
import { Trend } from '@/lib/db';
import TrendCard from './TrendCard';
import { FiZap } from 'react-icons/fi';

interface Props {
  allTrends: Trend[];
  initSearch: string;
  initCategory: string;
  categories: string[];
}

export default function HomeClient({ allTrends, initSearch, initCategory, categories }: Props) {
  const [cat, setCat] = useState(initCategory || 'All');
  const [q, setQ] = useState(initSearch || '');

  const filtered = useMemo(() => allTrends.filter(t => {
    const mCat = cat === 'All' || t.category === cat;
    const mQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()));
    return mCat && mQ;
  }), [allTrends, cat, q]);

  const newThisWeek = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    return allTrends.filter(t => new Date(t.createdAt) > cutoff);
  }, [allTrends]);

  return (
    <div className="mesh" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '70px 20px 36px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
          padding: '5px 16px', borderRadius: 50, marginBottom: 20,
          fontSize: 13, color: '#FF2D78', fontWeight: 700,
        }}>
          <FiZap size={13} /> {allTrends.length} AI Trends Live
        </div>

        <h1 style={{
          fontFamily: 'Unbounded,sans-serif',
          fontSize: 'clamp(28px,5.5vw,58px)',
          fontWeight: 900, lineHeight: 1.1, marginBottom: 14,
        }}>
          <span className="gradient-text">Trending AI Art</span><br />
          <span style={{ color: 'var(--text)' }}>+ Ready Prompts</span>
        </h1>

        <p style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.65 }}>
          Every viral AI art style — one prompt away. Copy & create instantly.
        </p>

        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="🔍  Search Ghibli, Neon, Anime, Dark..."
          style={{
            width: '100%', maxWidth: 460, padding: '13px 22px', borderRadius: 50,
            border: '2px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => (e.target.style.borderColor = '#FF2D78')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Category filters */}
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px 20px',
        maxWidth: 1280, margin: '0 auto', scrollbarWidth: 'none',
      }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`tag${cat === c ? ' active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 80px' }}>
        {/* New this week */}
        {!q && cat === 'All' && newThisWeek.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontFamily: 'Unbounded,sans-serif', fontSize: 19, fontWeight: 700,
              marginBottom: 20, color: 'var(--text)',
            }}>✨ New This Week</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 20, alignItems: 'stretch' }}>
              {newThisWeek.slice(0, 4).map(t => <TrendCard key={t.id} trend={t} />)}
            </div>
          </section>
        )}

        {/* Main grid */}
        <section>
          <h2 style={{
            fontFamily: 'Unbounded,sans-serif', fontSize: 19, fontWeight: 700,
            marginBottom: 20, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {q ? `Results for "${q}"` : cat !== 'All' ? `${cat} Trends` : '🔥 All Trends'}
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>({filtered.length})</span>
          </h2>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
              <p style={{ fontSize: 18 }}>No trends found. Try something else!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 20, alignItems: 'stretch' }}>
              {filtered.map(t => <TrendCard key={t.id} trend={t} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

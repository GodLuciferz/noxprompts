'use client';
import { useState, useMemo } from 'react';
import { Trend } from '@/lib/db';
import TrendCard from './TrendCard';
import SearchBar from './SearchBar';
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

  const allTitles = useMemo(() => allTrends.map(t => t.title), [allTrends]);
  const allTags = useMemo(() => Array.from(new Set(allTrends.flatMap(t => t.tags))), [allTrends]);

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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
    alignItems: 'stretch',
  };

  return (
    <div className="mesh" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'clamp(32px,6vw,70px) 16px 28px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)',
          padding: '5px 16px', borderRadius: 50, marginBottom: 16,
          fontSize: 13, color: '#FF2D78', fontWeight: 700,
        }}>
          <FiZap size={13} /> {allTrends.length} AI Trends Live
        </div>

        <h1 style={{
          fontFamily: 'Unbounded,sans-serif',
          fontSize: 'clamp(24px,5.5vw,58px)',
          fontWeight: 900, lineHeight: 1.1, marginBottom: 12,
        }}>
          <span className="gradient-text">Trending AI Art</span><br />
          <span style={{ color: 'var(--text)' }}>+ Ready Prompts</span>
        </h1>

        <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
          Every viral AI art style — one prompt away. Copy & create instantly.
        </p>

        <SearchBar allTitles={allTitles} allTags={allTags} initValue={q} onChange={setQ} />
      </div>

      {/* === TWO CARDS — Instagram + NoxLoad === */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 16px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20,
      }}>
        {/* Instagram Services Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,45,120,0.08), rgba(139,47,201,0.08))',
          border: '1.5px solid rgba(139,47,201,0.25)',
          borderRadius: 24, padding: '36px 32px', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          }}>📸</div>
          <h2 style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(18px, 3vw, 22px)',
            fontWeight: 900, margin: '0 0 10px',
            background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Instagram Services</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Followers, likes, views, comments & more — real growth at unbeatable prices. Instant delivery guaranteed.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            {['👥 Followers', '❤️ Likes', '🎬 Views', '💬 Comments'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(139,47,201,0.12)', border: '1px solid rgba(139,47,201,0.2)',
                borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--text)',
              }}>{tag}</span>
            ))}
          </div>
          <a href="/services" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 50,
            background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
            color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
            fontFamily: 'Unbounded, sans-serif',
          }}>
            🚀 View All Services
          </a>
        </div>

        {/* NoxLoad Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,255,128,0.06), rgba(0,200,100,0.06))',
          border: '1.5px solid rgba(0,255,128,0.2)',
          borderRadius: 24, padding: '36px 32px', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #00ff80, #00c864)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          }}>⚡</div>
          <h2 style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(18px, 3vw, 22px)',
            fontWeight: 900, margin: '0 0 10px',
            background: 'linear-gradient(135deg, #00ff80, #00c864)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>NoxLoad</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
            YouTube, Instagram, Twitter & 1000+ sites se videos download karo — free, fast & no signup needed.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            {['▶️ YouTube', '📸 Instagram', '🐦 Twitter/X', '🎵 TikTok'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(0,255,128,0.08)', border: '1px solid rgba(0,255,128,0.2)',
                borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'var(--text)',
              }}>{tag}</span>
            ))}
          </div>
          <a href="https://noxload.onrender.com" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 32px', borderRadius: 50,
            background: 'linear-gradient(135deg, #00ff80, #00c864)',
            color: '#000', fontWeight: 700, fontSize: 15, textDecoration: 'none',
            fontFamily: 'Unbounded, sans-serif',
          }}>
            ⚡ Open NoxLoad
          </a>
        </div>
      </div>

      {/* Category filters */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 16px',
        maxWidth: 1280, margin: '0 auto', scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`tag${cat === c ? ' active' : ''}`}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 80px' }}>
        {/* New This Week */}
        {!q && cat === 'All' && newThisWeek.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Unbounded,sans-serif', fontSize: 'clamp(15px,2vw,19px)', fontWeight: 700,
              marginBottom: 16, color: 'var(--text)',
            }}>✨ New This Week</h2>
            <div style={gridStyle}>
              {newThisWeek.slice(0, 4).map(t => <TrendCard key={t.id} trend={t} />)}
            </div>
          </section>
        )}

        {/* Main grid */}
        <section>
          <h2 style={{
            fontFamily: 'Unbounded,sans-serif', fontSize: 'clamp(15px,2vw,19px)', fontWeight: 700,
            marginBottom: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {q ? `Results for "${q}"` : cat !== 'All' ? `${cat} Trends` : '🔥 All Trends'}
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>({filtered.length})</span>
          </h2>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
              <p>No trends found. Try something else!</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {filtered.map(t => <TrendCard key={t.id} trend={t} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

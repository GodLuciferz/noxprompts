'use client';
import { useState, useMemo } from 'react';
import { Trend } from '@/lib/db';
import TrendCard from './TrendCard';
import { FiZap } from 'react-icons/fi';

interface Props {
  allTrends: Trend[];
  searchParams: { search?: string; category?: string };
  categories: string[];
}

export default function HomeClient({ allTrends, searchParams, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState(searchParams.category || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');

  const filtered = useMemo(() => {
    return allTrends.filter((t) => {
      const matchCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [allTrends, activeCategory, searchQuery]);

  const trending = filtered.filter((t) => t.isTrending);
  const newThisWeek = filtered.filter((t) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(t.createdAt) > weekAgo;
  });

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px 40px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,45,120,0.1)',
            border: '1px solid rgba(255,45,120,0.3)',
            padding: '6px 16px',
            borderRadius: '50px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#FF2D78',
            fontWeight: 600,
          }}
        >
          <FiZap size={14} /> {allTrends.length} Trending Prompts Live
        </div>

        <h1
          style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '16px',
          }}
        >
          <span className="gradient-text">AI Art Trends</span>
          <br />
          <span style={{ color: 'var(--text)' }}>+ Ready Prompts</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
          Every viral AI art style — one prompt away. Copy & create instantly.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍  Search Ghibli, Neon, Anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '14px 24px',
            borderRadius: '50px',
            border: '2px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#FF2D78')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Category Filter */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '0 20px 20px',
          maxWidth: '1280px',
          margin: '0 auto',
          scrollbarWidth: 'none',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`tag-pill ${activeCategory === cat ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 80px' }}>
        {/* New This Week */}
        {newThisWeek.length > 0 && !searchQuery && activeCategory === 'All' && (
          <section style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text)',
              }}
            >
              ✨ New This Week
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {newThisWeek.slice(0, 4).map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </section>
        )}

        {/* All / Filtered Trends */}
        <section>
          <h2
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '20px',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory !== 'All'
              ? `${activeCategory} Trends`
              : '🔥 All Trends'}
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)' }}>
              ({filtered.length})
            </span>
          </h2>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '18px' }}>No trends found. Try a different search!</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {filtered.map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

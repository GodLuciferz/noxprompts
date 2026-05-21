'use client';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { FiSun, FiMoon, FiZap } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav
      style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FiZap color="white" size={16} />
          </div>
          <span
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            NoxPrompts
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search trends... (Ghibli, Neon, Anime...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '50px',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </form>

        <div style={{ flex: 1 }} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </nav>
  );
}

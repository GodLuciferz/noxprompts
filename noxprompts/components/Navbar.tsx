'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [q, setQ] = useState('');
  const router = useRouter();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 20px',
        height: 64, display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src="https://res.cloudinary.com/dirmb9e0e/image/upload/v1779549564/noxpromptlogo_kx2ykr.webp"
            alt="NoxPrompts Logo"
            width={42}
            height={42}
            style={{ borderRadius: 10, objectFit: 'contain' }}
          />
          <span style={{
            fontFamily: 'Unbounded,sans-serif', fontWeight: 800, fontSize: 18,
            background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>NoxPrompts</span>
        </Link>

        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/?search=${encodeURIComponent(q)}`); }}
          style={{ flex: 1, maxWidth: 420 }}>
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="🔍  Search Ghibli, Neon, Anime..."
            style={{
              width: '100%', padding: '9px 18px', borderRadius: 50,
              border: '1.5px solid var(--border)', background: 'var(--bg)',
              color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
            }} />
        </form>

        <div style={{ flex: 1 }} />

        {/* Theme toggle */}
        <button onClick={toggle} style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '1.5px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>
    </nav>
  );
}

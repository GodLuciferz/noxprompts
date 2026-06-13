'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import { FiSun, FiMoon, FiShoppingBag } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [q, setQ] = useState('');
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.noxzone111.online/orders' },
    });
  };

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    setUser(null);
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 16px',
        height: 60, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Image
            src="https://res.cloudinary.com/dirmb9e0e/image/upload/v1779549564/noxpromptlogo_kx2ykr.webp"
            alt="NoxPrompts Logo"
            width={38} height={38}
            style={{ borderRadius: 9, objectFit: 'contain' }}
          />
          <span style={{
            fontFamily: 'Unbounded,sans-serif', fontWeight: 800,
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap',
          }}>NoxPrompts</span>
        </Link>

        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/?search=${encodeURIComponent(q)}`); }}
          style={{ flex: 1, maxWidth: 420 }}
        >
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="🔍  Search Ghibli, Neon, Anime..."
            style={{
              width: '100%', padding: '8px 16px', borderRadius: 50,
              border: '1.5px solid var(--border)', background: 'var(--bg)',
              color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </form>

        <div style={{ flex: 1 }} />

        {/* Orders link — only when logged in */}
        {user && (
          <Link href="/orders" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 14px', borderRadius: 50,
            border: '1px solid rgba(139,47,201,0.3)',
            background: 'rgba(139,47,201,0.08)',
            color: 'var(--purple)', fontWeight: 700, fontSize: 12,
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <FiShoppingBag size={13} />
            <span style={{ display: 'none' }} className="sm-show">Orders</span>
          </Link>
        )}

        {/* Login / Avatar */}
        {user ? (
          <button onClick={handleLogout} title={`Logout (${user.email})`} style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            border: '2px solid var(--purple)', background: 'var(--purple)',
            color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}>
            {user.email?.[0]?.toUpperCase() || '?'}
          </button>
        ) : (
          <button onClick={handleLogin} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 50, flexShrink: 0,
            border: '1.5px solid var(--border)', background: 'var(--bg)',
            color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login
          </button>
        )}

        {/* Theme toggle */}
        <button onClick={toggle} style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          border: '1.5px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>
      </div>
    </nav>
  );
}

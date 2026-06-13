'use client';
import InstagramServices from '@/components/InstagramServices';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function ServicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) setShowLoginModal(true); // Show popup if not logged in
      setChecked(true);
    });
  }, []);

  const handleGoogleLogin = async () => {
    await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.noxzone111.online/services' },
    });
  };

  return (
    <main style={{ minHeight: '100vh', paddingTop: 32 }}>

      {/* Login Modal */}
      {showLoginModal && checked && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1.5px solid var(--border)',
            borderRadius: 24, padding: '36px 28px', maxWidth: 380, width: '100%',
            textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
            <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 20, fontWeight: 900, margin: '0 0 8px' }}>
              Instagram Services
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
              Login to track your orders, view history & get refills easily
            </p>

            <button onClick={handleGoogleLogin} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, padding: '13px 20px', borderRadius: 50,
              border: '1.5px solid var(--border)', background: 'var(--bg)',
              color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 14, fontWeight: 700, marginBottom: 12,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button onClick={() => setShowLoginModal(false)} style={{
              width: '100%', padding: '11px 20px', borderRadius: 50,
              border: '1px solid var(--border)', background: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600,
            }}>
              Skip for now →
            </button>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>
              ⚠️ Login required to place orders
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900,
            background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 10px',
          }}>Instagram Services</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 16px' }}>
            Real followers, likes, views & more — instant delivery at unbeatable prices
          </p>

          {/* Order History Button */}
          <Link href="/orders" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', borderRadius: 50,
            background: 'rgba(139,47,201,0.1)', border: '1px solid rgba(139,47,201,0.25)',
            color: 'var(--purple)', fontWeight: 700, fontSize: 13, textDecoration: 'none',
          }}>
            📦 {user ? 'My Order History' : 'View Order History'}
          </Link>
        </div>

        <InstagramServices />
      </div>
    </main>
  );
}

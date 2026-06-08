'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id') || '';
  const slug = params.get('slug') || '';

  useEffect(() => {
    if (slug) {
      // Redirect to prompt page with unlocked=true after 2 seconds
      const timer = setTimeout(() => {
        window.location.href = `/trends/${slug}?unlocked=true`;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [slug]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '20px',
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 24, padding: '40px 32px', maxWidth: 420, width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{
          fontFamily: 'Unbounded, sans-serif', fontSize: 22, fontWeight: 900,
          color: 'var(--text)', margin: '0 0 10px',
        }}>Payment Successful!</h1>

        {orderId && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px' }}>
            Transaction ID: {orderId}
          </p>
        )}

        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 24px' }}>
          Your prompt has been unlocked. Redirecting...
        </p>

        <div style={{
          width: '100%', height: 4, background: 'var(--border)',
          borderRadius: 4, overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            height: '100%', width: '100%',
            background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
            animation: 'progress 2s linear forwards',
          }} />
        </div>

        {slug && (
          <Link href={`/trends/${slug}?unlocked=true`} style={{
            display: 'inline-block', padding: '12px 28px', borderRadius: 50,
            background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
            color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}>
            🔓 View Unlocked Prompt
          </Link>
        )}
      </div>

      <style>{`
        @keyframes progress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

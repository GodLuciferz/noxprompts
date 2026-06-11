'use client';
import InstagramServices from '@/components/InstagramServices';

export default function ServicesPage() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: 32 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px',
          }}>
            Instagram Services
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
            Real followers, likes, views & more — instant delivery at unbeatable prices
          </p>
        </div>
        <InstagramServices />
      </div>
    </main>
  );
}

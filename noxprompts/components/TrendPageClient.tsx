'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trend } from '@/lib/db';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck, FiShare2, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import TrendCard from './TrendCard';
import LockedPrompt from './LockedPrompt';

export default function TrendPageClient({ trend, related }: { trend: Trend; related: Trend[] }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(trend.prompt);
    setCopied(true);
    toast.success('Prompt copied! 🎨');
    await fetch(`/api/copy/${trend.slug}`, { method: 'POST' });
    setTimeout(() => setCopied(false), 2500);
  };

  const share = () => {
    const url = window.location.href;
    const text = `✨ Check out this AI art trend: ${trend.title}\n🎨 Get the prompt here:\n${url}`;
    if (navigator.share) {
      navigator.share({ title: trend.title, text, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const tryPrompt = () => {
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(trend.prompt)}`, '_blank');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 80px' }}>
      {/* Back */}
      <Link href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14,
        marginBottom: 24, fontWeight: 600,
      }}>
        <FiArrowLeft size={15} /> Back to Trends
      </Link>

      {/* Badges + Title */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {trend.isTrending && <span className="hot-badge">🔥 Trending</span>}
          <span style={{
            background: 'rgba(139,47,201,0.12)', color: 'var(--purple)',
            border: '1px solid rgba(139,47,201,0.25)',
            fontSize: 12, padding: '4px 12px', borderRadius: 50, fontWeight: 600,
          }}>{trend.category}</span>
        </div>
        <h1 style={{
          fontFamily: 'Unbounded,sans-serif',
          fontSize: 'clamp(20px,4vw,36px)',
          fontWeight: 900, lineHeight: 1.2, color: 'var(--text)',
        }}>{trend.title}</h1>
      </div>

      {/* Hero image */}
      <div style={{
        position: 'relative', width: '100%', borderRadius: 18,
        overflow: 'hidden', marginBottom: 28,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        aspectRatio: '16/9',
      }}>
        <Image src={trend.imageUrl} alt={trend.title} fill style={{ objectFit: 'cover' }} priority />
      </div>

      {/* Prompt box */}
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 18, padding: '20px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
            📋 The Prompt
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{trend.copyCount || 0} copies</span>
        </div>

        {trend.isPaid ? (
          <LockedPrompt
            promptSlug={trend.slug}
            promptName={trend.title}
            price={trend.price || 9}
            previewText={trend.prompt.substring(0, 60)}
          />
        ) : (
          <>
            <div style={{
              background: 'var(--bg)', borderRadius: 12, padding: '16px',
              fontSize: 14, lineHeight: 1.7, color: 'var(--text)',
              fontFamily: 'monospace', marginBottom: 16, wordBreak: 'break-word',
              border: '1px solid var(--border)',
            }}>
              {trend.prompt}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={copyPrompt} className="btn-primary" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: copied
                  ? 'linear-gradient(135deg,#00C851,#007E33)'
                  : 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
              }}>
                {copied ? <><FiCheck size={15} /> Copied!</> : <><FiCopy size={15} /> Copy Prompt</>}
              </button>

              <button onClick={tryPrompt} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,200,255,0.1)', border: '1.5px solid rgba(0,200,255,0.3)',
                color: 'var(--cyan)', padding: '11px 20px', borderRadius: 50,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <FiExternalLink size={14} /> Try on ChatGPT
              </button>

              <button onClick={share} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: '1.5px solid var(--border)',
                color: 'var(--text-muted)', padding: '11px 20px', borderRadius: 50,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <FiShare2 size={14} /> Share
              </button>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      {trend.description && (
        <div style={{
          background: 'var(--bg-card)', border: '1.5px solid var(--border)',
          borderRadius: 18, padding: '20px', marginBottom: 20,
        }}>
          <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
            💡 About This Style
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>{trend.description}</p>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
        {trend.tags.map(t => (
          <Link key={t} href={`/?search=${t}`} style={{ textDecoration: 'none' }}>
            <span className="tag">#{t}</span>
          </Link>
        ))}
      </div>

      {/* Related Trends */}
      {related.length > 0 && (
        <section>
          <h2 style={{
            fontFamily: 'Unbounded,sans-serif', fontSize: 18, fontWeight: 800,
            marginBottom: 20, color: 'var(--text)',
          }}>🎨 You Might Also Like</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16, alignItems: 'stretch',
          }}>
            {related.map(t => <TrendCard key={t.id} trend={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}

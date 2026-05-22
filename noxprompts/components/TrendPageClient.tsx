'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trend } from '@/lib/db';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck, FiShare2, FiArrowLeft, FiExternalLink } from 'react-icons/fi';

export default function TrendPageClient({ trend }: { trend: Trend }) {
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Back */}
      <Link href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14,
        marginBottom: 28, fontWeight: 600,
      }}>
        <FiArrowLeft size={15} /> Back to Trends
      </Link>

      {/* Title + badges */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {trend.isTrending && <span className="hot-badge">🔥 Trending</span>}
          <span style={{
            background: 'rgba(139,47,201,0.12)', color: 'var(--purple)',
            border: '1px solid rgba(139,47,201,0.25)',
            fontSize: 12, padding: '4px 12px', borderRadius: 50, fontWeight: 600,
          }}>{trend.category}</span>
        </div>
        <h1 style={{
          fontFamily: 'Unbounded,sans-serif', fontSize: 'clamp(22px,4vw,38px)',
          fontWeight: 900, lineHeight: 1.2, color: 'var(--text)', marginBottom: 8,
        }}>{trend.title}</h1>
      </div>

      {/* Hero image */}
      <div style={{
        position: 'relative', width: '100%', borderRadius: 20,
        overflow: 'hidden', marginBottom: 36,
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        aspectRatio: '16/9',
      }}>
        <Image src={trend.imageUrl} alt={trend.title} fill style={{ objectFit: 'cover' }} priority />
      </div>

      {/* Prompt box */}
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 18, padding: '24px', marginBottom: 28,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <h2 style={{
            fontFamily: 'Unbounded,sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text)',
          }}>📋 The Prompt</h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {trend.copyCount || 0} copies
          </span>
        </div>

        <div style={{
          background: 'var(--bg)', borderRadius: 12, padding: '18px 20px',
          fontSize: 15, lineHeight: 1.7, color: 'var(--text)',
          fontFamily: 'monospace', marginBottom: 18, wordBreak: 'break-word',
          border: '1px solid var(--border)',
        }}>
          {trend.prompt}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={copyPrompt} className="btn-primary" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: copied
              ? 'linear-gradient(135deg,#00C851,#007E33)'
              : 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
          }}>
            {copied ? <><FiCheck size={16} /> Copied!</> : <><FiCopy size={16} /> Copy Prompt</>}
          </button>

          <button onClick={tryPrompt} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,200,255,0.1)', border: '1.5px solid rgba(0,200,255,0.3)',
            color: 'var(--cyan)', padding: '12px 22px', borderRadius: 50,
            fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <FiExternalLink size={15} /> Try on ChatGPT
          </button>

          <button onClick={share} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: '1.5px solid var(--border)',
            color: 'var(--text-muted)', padding: '12px 22px', borderRadius: 50,
            fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <FiShare2 size={15} /> Share
          </button>
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 18, padding: '24px', marginBottom: 28,
      }}>
        <h2 style={{
          fontFamily: 'Unbounded,sans-serif', fontSize: 16, fontWeight: 700,
          color: 'var(--text)', marginBottom: 12,
        }}>💡 About This Style</h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
          {trend.description}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {trend.tags.map(t => (
          <Link key={t} href={`/?search=${t}`} style={{ textDecoration: 'none' }}>
            <span className="tag">#{t}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

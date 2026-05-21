'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Trend } from '@/lib/db';
import { FiCopy, FiCheck, FiShare2, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TrendDetailClient({ trend }: { trend: Trend }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trend.prompt);
    setCopied(true);
    toast.success('Prompt copied! 🎨');
    // increment copy count
    fetch(`/api/copy/${trend.slug}`, { method: 'POST' }).catch(() => {});
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `🔥 ${trend.title} — AI Art Prompt\n\n"${trend.prompt.slice(0, 80)}..."\n\nGet it here: ${url}`;
    if (navigator.share) {
      navigator.share({ title: trend.title, text, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const tryInChatGPT = () => {
    const encoded = encodeURIComponent(
      `Generate an image with this prompt: ${trend.prompt}`
    );
    window.open(`https://chatgpt.com/?q=${encoded}`, '_blank');
  };

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Back */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '32px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--nox-pink)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
        >
          <FiArrowLeft size={16} /> Back to all trends
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {trend.isTrending && <span className="trending-badge">🔥 Trending</span>}
            <span
              style={{
                background: 'rgba(139,47,201,0.15)',
                border: '1px solid rgba(139,47,201,0.3)',
                color: 'var(--nox-purple)',
                fontSize: '12px',
                fontWeight: 600,
                padding: '3px 12px',
                borderRadius: '50px',
              }}
            >
              {trend.category}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: 'clamp(24px, 4vw, 42px)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '12px',
            }}
          >
            <span className="gradient-text">{trend.title}</span>
          </h1>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {trend.tags.map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontSize: '12px' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div
          className="nox-card"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            marginBottom: '32px',
            borderRadius: '20px',
          }}
        >
          <Image
            src={trend.imageUrl}
            alt={trend.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Prompt Box */}
        <div
          className="nox-card"
          style={{
            padding: '28px',
            marginBottom: '24px',
            border: '1px solid rgba(0,200,255,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--nox-cyan)',
                margin: 0,
              }}
            >
              ✨ The Prompt
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {trend.copyCount || 0} people copied this
            </span>
          </div>

          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'var(--text)',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              userSelect: 'all',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {trend.prompt}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopy}
              className="nox-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                padding: '12px 28px',
                background: copied
                  ? 'linear-gradient(135deg, #00C853, #00897B)'
                  : 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
              }}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>

            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <FiShare2 size={16} /> Share
            </button>

            <button
              onClick={tryInChatGPT}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0,200,255,0.1)',
                border: '1px solid rgba(0,200,255,0.3)',
                color: 'var(--nox-cyan)',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <FiExternalLink size={16} /> Try in ChatGPT
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="nox-card" style={{ padding: '28px' }}>
          <h2
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '14px',
              color: 'var(--text)',
            }}
          >
            📖 About This Style
          </h2>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'var(--text-muted)',
            }}
          >
            {trend.description}
          </p>
        </div>
      </div>
    </div>
  );
}

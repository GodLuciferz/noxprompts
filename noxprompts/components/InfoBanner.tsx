'use client';
import { useEffect, useState } from 'react';
import { FiX, FiExternalLink, FiInfo } from 'react-icons/fi';

interface SiteLink { label: string; url: string; icon?: string; }
interface SiteInfo { title: string; description: string; links: SiteLink[]; }

export default function InfoBanner() {
  const [info, setInfo] = useState<SiteInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/info').then(r => r.json()).then(d => {
      if (d && (d.title || d.description || (d.links && d.links.length > 0))) {
        setInfo(d);
      }
    }).catch(() => {});
  }, []);

  if (!info || dismissed) return null;
  if (!info.title && !info.description && (!info.links || info.links.length === 0)) return null;

  return (
    <>
      {/* Floating Info Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 500,
          width: 50, height: 50, borderRadius: '50%',
          background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
          border: 'none', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(255,45,120,0.4)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title={info.title || 'Info'}
      >
        <FiInfo size={22} />
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', borderRadius: 24,
              padding: '28px', maxWidth: 480, width: '100%',
              border: '1.5px solid var(--border)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button onClick={() => setOpen(false)} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'var(--bg)', border: '1px solid var(--border)',
              width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
            }}><FiX size={16} /></button>

            {/* Title */}
            {info.title && (
              <h2 style={{
                fontFamily: 'Unbounded,sans-serif', fontSize: 20, fontWeight: 800,
                marginBottom: 12, color: 'var(--text)', paddingRight: 40,
              }}>{info.title}</h2>
            )}

            {/* Description */}
            {info.description && (
              <p style={{
                fontSize: 15, lineHeight: 1.7, color: 'var(--text-muted)',
                marginBottom: info.links?.length > 0 ? 20 : 0,
              }}>{info.description}</p>
            )}

            {/* Links */}
            {info.links && info.links.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {info.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      color: 'var(--text)', fontSize: 14, fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#FF2D78'; (e.currentTarget as HTMLElement).style.color = '#FF2D78'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                  >
                    <span>{link.icon && `${link.icon} `}{link.label}</span>
                    <FiExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}
            {/* Legal Pages */}
<div
  style={{
    marginTop: 20,
    paddingTop: 16,
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  }}
>
  <a href="/privacy" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: 14 }}>
    Privacy Policy
  </a>

  <a href="/terms" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: 14 }}>
    Terms & Conditions
  </a>

  <a href="/contact" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: 14 }}>
    Contact Us
  </a>

  <a href="/refund" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: 14 }}>
    refund policy
  </a>
  
</div>
          </div>
        </div>
      )}
    </>
  );
}

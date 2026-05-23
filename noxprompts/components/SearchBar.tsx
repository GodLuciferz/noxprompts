'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

interface Props {
  allTitles: string[];
  allTags: string[];
  initValue?: string;
  onChange?: (val: string) => void;
}

export default function SearchBar({ allTitles, allTags, initValue = '', onChange }: Props) {
  const [q, setQ] = useState(initValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (val: string) => {
    setQ(val);
    onChange?.(val);
    if (val.trim().length < 1) { setSuggestions([]); setOpen(false); return; }
    const lower = val.toLowerCase();
    const matches = [
      ...allTitles.filter(t => t.toLowerCase().includes(lower)),
      ...allTags.filter(t => t.toLowerCase().includes(lower)),
    ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6);
    setSuggestions(matches);
    setOpen(matches.length > 0);
  };

  const select = (val: string) => {
    setQ(val);
    setOpen(false);
    onChange?.(val);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 460, margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        <FiSearch size={16} style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none',
        }} />
        <input
          value={q}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search Ghibli, Neon, Anime, Dark..."
          style={{
            width: '100%', padding: '12px 20px 12px 42px', borderRadius: 50,
            border: '2px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.3s',
          }}
          onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#FF2D78'; suggestions.length > 0 && setOpen(true); }}
          onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
        />
      </div>

      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--bg-card)', border: '1.5px solid var(--border)',
          borderRadius: 16, overflow: 'hidden', zIndex: 200,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }}>
          {suggestions.map((s, i) => (
            <div key={i} onClick={() => select(s)}
              style={{
                padding: '11px 18px', cursor: 'pointer', fontSize: 14,
                color: 'var(--text)', transition: 'background 0.15s',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,47,201,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <FiSearch size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

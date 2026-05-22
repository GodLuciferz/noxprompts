'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Trend, CATEGORIES } from '@/lib/db';
import { FiPlus, FiTrash2, FiEdit2, FiLogOut, FiUpload, FiZap } from 'react-icons/fi';

const PASS = '@noxstudio123';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'list' | 'add'>('list');
  const [editTrend, setEditTrend] = useState<Trend | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Anime');
  const [tags, setTags] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authed) fetchTrends();
  }, [authed]);

  async function fetchTrends() {
    setLoading(true);
    const res = await fetch('/api/trends');
    const data = await res.json();
    setTrends(data);
    setLoading(false);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-password': PASS },
      body: fd,
    });
    const data = await res.json();
    setImageUrl(data.url);
    setImagePreview(data.url);
    setUploading(false);
    toast.success('Image uploaded!');
  }

  function resetForm() {
    setTitle(''); setCategory('Anime'); setTags(''); setPrompt('');
    setDescription(''); setIsTrending(false); setImageUrl(''); setImagePreview('');
    setEditTrend(null);
  }

  function loadEdit(t: Trend) {
    setEditTrend(t);
    setTitle(t.title); setCategory(t.category); setTags(t.tags.join(', '));
    setPrompt(t.prompt); setDescription(t.description); setIsTrending(t.isTrending);
    setImageUrl(t.imageUrl); setImagePreview(t.imageUrl);
    setTab('add');
  }

  async function handleSubmit() {
    if (!title || !prompt || !imageUrl) {
      toast.error('Title, prompt and image are required!'); return;
    }
    const body = {
      title, category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      prompt, description, isTrending, imageUrl,
      ...(editTrend ? { slug: editTrend.slug } : {}),
    };
    const method = editTrend ? 'PATCH' : 'POST';
    const res = await fetch('/api/trends/manage', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': PASS },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.ok) {
      toast.success(editTrend ? 'Trend updated! ✅' : 'Trend added! 🚀');
      resetForm(); setTab('list'); fetchTrends();
    } else {
      toast.error('Something went wrong');
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this trend?')) return;
    await fetch('/api/trends/manage', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': PASS },
      body: JSON.stringify({ slug }),
    });
    toast.success('Deleted!');
    fetchTrends();
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '40px 36px', width: 360, textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <FiZap color="#fff" size={24} />
          </div>
          <h1 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            NoxPrompts
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Admin Panel</p>
          <input
            type="password" placeholder="Enter password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pw === PASS ? setAuthed(true) : toast.error('Wrong password'))}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12, marginBottom: 14,
              border: '1.5px solid var(--border)', background: 'var(--bg)',
              color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button className="btn-primary" style={{ width: '100%' }}
            onClick={() => pw === PASS ? setAuthed(true) : toast.error('Wrong password')}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 26, fontWeight: 900 }}>
            <span className="gradient-text">Admin Panel</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            {trends.length} trends total
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={() => { resetForm(); setTab('add'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiPlus size={16} /> Add Trend
          </button>
          <button onClick={() => setAuthed(false)} style={{
            background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
            padding: '10px 18px', borderRadius: 50, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['list', 'add'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'list') resetForm(); }}
            style={{
              padding: '8px 22px', borderRadius: 50, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14,
              background: tab === t ? 'linear-gradient(135deg,#FF2D78,#8B2FC9)' : 'var(--bg-card)',
              color: tab === t ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {t === 'list' ? '📋 All Trends' : editTrend ? '✏️ Edit Trend' : '➕ Add Trend'}
          </button>
        ))}
      </div>

      {/* List Tab */}
      {tab === 'list' && (
        <div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 60 }}>Loading...</p>
          ) : trends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
              <p style={{ fontSize: 18 }}>No trends yet. Add your first one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {trends.map(t => (
                <div key={t.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <img src={t.imageUrl} alt={t.title}
                    style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 14 }}>
                        {t.title}
                      </span>
                      {t.isTrending && <span className="hot-badge">🔥</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                      <span>{t.category}</span>
                      <span>📋 {t.copyCount} copies</span>
                      <span>/{t.slug}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => loadEdit(t)} style={{
                      background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.25)',
                      color: '#00C8FF', padding: '7px 14px', borderRadius: 10,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: 'inherit',
                    }}>
                      <FiEdit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(t.slug)} style={{
                      background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.25)',
                      color: '#FF2D78', padding: '7px 14px', borderRadius: 10,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: 'inherit',
                    }}>
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Tab */}
      {tab === 'add' && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '32px',
        }}>
          <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 28 }}>
            {editTrend ? '✏️ Edit Trend' : '➕ New Trend'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Title */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Trend Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Ghibli Dream Art" style={inputStyle} />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)}
                placeholder="ghibli, anime, japan, soft" style={inputStyle} />
            </div>

            {/* Image Upload */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Trend Image *</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed var(--border)', borderRadius: 14, padding: '28px',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.3s',
                  background: 'var(--bg)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF2D78')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview"
                    style={{ maxHeight: 200, borderRadius: 10, objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <FiUpload size={32} style={{ marginBottom: 10 }} />
                    <p>{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </div>

            {/* Prompt */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Prompt *</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Enter the full AI prompt here..."
                rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe this art style, what makes it unique..."
                rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Trending toggle */}
            <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 14 }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600 }}>
                <div
                  onClick={() => setIsTrending(!isTrending)}
                  style={{
                    width: 48, height: 26, borderRadius: 13,
                    background: isTrending ? 'linear-gradient(135deg,#FF6B00,#FFD000)' : 'var(--border)',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
                  }}>
                  <div style={{
                    position: 'absolute', top: 3, left: isTrending ? 25 : 3,
                    width: 20, height: 20, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }} />
                </div>
                🔥 Mark as Trending
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button className="btn-primary" onClick={handleSubmit} style={{ minWidth: 160 }}>
              {editTrend ? '✅ Update Trend' : '🚀 Add Trend'}
            </button>
            <button onClick={() => { resetForm(); setTab('list'); }} style={{
              background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
              padding: '12px 24px', borderRadius: 50, cursor: 'pointer', fontFamily: 'inherit', fontSize: 15,
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '1.5px solid var(--border)', background: 'var(--bg)',
  color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 700,
  color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.03em',
};

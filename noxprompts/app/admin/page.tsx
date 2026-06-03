'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Trend, CATEGORIES } from '@/lib/db';
import { FiPlus, FiTrash2, FiEdit2, FiLogOut, FiUpload, FiZap, FiInfo, FiLink, FiX } from 'react-icons/fi';

const PASS = '@noxstudio123';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'list' | 'add' | 'info'>('list');
  const [editTrend, setEditTrend] = useState<Trend | null>(null);

  // Trend form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Anime');
  const [tags, setTags] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(9);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Info form
  const [infoTitle, setInfoTitle] = useState('');
  const [infoDesc, setInfoDesc] = useState('');
  const [links, setLinks] = useState<{label:string;url:string;icon:string}[]>([]);

  useEffect(() => {
    if (authed) { fetchTrends(); fetchInfo(); }
  }, [authed]);

  async function fetchTrends() {
    setLoading(true);
    const res = await fetch('/api/trends');
    const data = await res.json();
    setTrends(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function fetchInfo() {
    const res = await fetch('/api/info');
    const data = await res.json();
    setInfoTitle(data.title || '');
    setInfoDesc(data.description || '');
    setLinks(data.links || []);
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
    if (data.url) {
      setImageUrl(data.url);
      setImagePreview(data.url);
      toast.success('Image uploaded! ✅');
    } else {
      toast.error('Upload failed');
    }
    setUploading(false);
  }

  function resetForm() {
    setTitle(''); setCategory('Anime'); setTags(''); setPrompt('');
    setDescription(''); setIsTrending(false); setIsPaid(false); setPrice(9);
    setImageUrl(''); setImagePreview('');
    setEditTrend(null);
  }

  function loadEdit(t: Trend) {
    setEditTrend(t);
    setTitle(t.title); setCategory(t.category); setTags(t.tags.join(', '));
    setPrompt(t.prompt); setDescription(t.description); setIsTrending(t.isTrending);
    setIsPaid(t.isPaid || false); setPrice(t.price || 9);
    setImageUrl(t.imageUrl); setImagePreview(t.imageUrl);
    setTab('add');
  }

  async function handleSubmit() {
    if (!title || !prompt || !imageUrl) { toast.error('Title, prompt and image required!'); return; }
    const body = {
      title, category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      prompt, description, isTrending, isPaid, price: isPaid ? price : 0, imageUrl,
      ...(editTrend ? { slug: editTrend.slug } : {}),
    };
    const res = await fetch('/api/trends/manage', {
      method: editTrend ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': PASS },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.ok) {
      toast.success(editTrend ? 'Updated! ✅' : 'Added! 🚀');
      resetForm(); setTab('list'); fetchTrends();
    } else { toast.error('Something went wrong'); }
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

  async function saveInfo() {
    const res = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': PASS },
      body: JSON.stringify({ title: infoTitle, description: infoDesc, links }),
    });
    const data = await res.json();
    if (data.ok) toast.success('Info saved! ✅');
    else toast.error('Failed');
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px 36px', width: 360, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FiZap color="#fff" size={24} />
          </div>
          <h1 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>NoxPrompts</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Admin Panel</p>
          <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pw === PASS ? setAuthed(true) : toast.error('Wrong password'))}
            style={{ ...inputStyle, marginBottom: 14 }} />
          <button className="btn-primary" style={{ width: '100%' }}
            onClick={() => pw === PASS ? setAuthed(true) : toast.error('Wrong password')}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 24, fontWeight: 900 }}>
            <span className="gradient-text">Admin Panel</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{trends.length} trends total</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" onClick={() => { resetForm(); setTab('add'); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiPlus size={16} /> Add Trend
          </button>
          <button onClick={() => setAuthed(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '10px 16px', borderRadius: 50, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiLogOut size={15} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([['list','📋 Trends'], ['add', editTrend ? '✏️ Edit' : '➕ Add'], ['info','ℹ️ Info & Links']] as const).map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); if (t === 'list') resetForm(); }}
            style={{
              padding: '8px 20px', borderRadius: 50, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13,
              background: tab === t ? 'linear-gradient(135deg,#FF2D78,#8B2FC9)' : 'var(--bg-card)',
              color: tab === t ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* LIST TAB */}
      {tab === 'list' && (
        <div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 60 }}>Loading...</p>
          ) : trends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
              <p>No trends yet. Add your first one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trends.map(t => (
                <div key={t.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <img src={t.imageUrl} alt={t.title} style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Unbounded,sans-serif', fontWeight: 700, fontSize: 13 }}>{t.title}</span>
                      {t.isTrending && <span className="hot-badge">🔥</span>}
                      {t.isPaid && (
                        <span style={{ background: 'linear-gradient(135deg,#8B2FC9,#FF2D78)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                          💎 ₹{t.price}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span>{t.category}</span>
                      <span>📋 {t.copyCount} copies</span>
                      <span style={{ opacity: 0.7 }}>/{t.slug}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => loadEdit(t)} style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.25)', color: '#00C8FF', padding: '7px 14px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: 'inherit' }}>
                      <FiEdit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(t.slug)} style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.25)', color: '#FF2D78', padding: '7px 14px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: 'inherit' }}>
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT TAB */}
      {tab === 'add' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px' }}>
          <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 24 }}>
            {editTrend ? '✏️ Edit Trend' : '➕ New Trend'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Trend Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Ghibli Dream Art" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="ghibli, anime, soft" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Trend Image *</label>
              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--border)', borderRadius: 14, padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)', transition: 'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF2D78')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ maxHeight: 180, borderRadius: 10, objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <FiUpload size={28} style={{ marginBottom: 8 }} />
                    <p>{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Prompt *</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter the full AI prompt..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this art style..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Trending Toggle */}
            <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div onClick={() => setIsTrending(!isTrending)} style={{ width: 48, height: 26, borderRadius: 13, background: isTrending ? 'linear-gradient(135deg,#FF6B00,#FFD000)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                <div style={{ position: 'absolute', top: 3, left: isTrending ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>🔥 Mark as Trending</span>
            </div>

            {/* 💎 Paid Toggle */}
            <div style={{ gridColumn: '1/-1', background: 'rgba(139,47,201,0.08)', border: '1.5px solid rgba(139,47,201,0.2)', borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3 }}>💎 Paid Prompt</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Users must pay to unlock this prompt</p>
                </div>
                <div onClick={() => setIsPaid(!isPaid)} style={{ width: 48, height: 26, borderRadius: 13, background: isPaid ? 'linear-gradient(135deg,#8B2FC9,#FF2D78)' : 'var(--border)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: isPaid ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
              {isPaid && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--purple)' }}>₹</span>
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    style={{ ...inputStyle, width: 100 }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>per unlock</span>
                </div>
              )}
            </div>

          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" onClick={handleSubmit}>{editTrend ? '✅ Update' : '🚀 Add Trend'}</button>
            <button onClick={() => { resetForm(); setTab('list'); }} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 24px', borderRadius: 50, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* INFO TAB */}
      {tab === 'info' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px' }}>
          <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 17, fontWeight: 800, marginBottom: 24 }}>
            ℹ️ Info & Links Section
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
            Yeh info users ko ek floating button se dikhegi. Title, description aur links add karo.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input value={infoTitle} onChange={e => setInfoTitle(e.target.value)} placeholder="e.g. About NoxPrompts" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={infoDesc} onChange={e => setInfoDesc(e.target.value)} placeholder="Apne website ke baare mein likho..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Links */}
            <div>
              <label style={labelStyle}>Links</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input value={link.icon} onChange={e => { const l = [...links]; l[i].icon = e.target.value; setLinks(l); }}
                      placeholder="Emoji" style={{ ...inputStyle, width: 60, flexShrink: 0 }} />
                    <input value={link.label} onChange={e => { const l = [...links]; l[i].label = e.target.value; setLinks(l); }}
                      placeholder="Label e.g. Instagram" style={{ ...inputStyle, flex: 1 }} />
                    <input value={link.url} onChange={e => { const l = [...links]; l[i].url = e.target.value; setLinks(l); }}
                      placeholder="https://..." style={{ ...inputStyle, flex: 2 }} />
                    <button onClick={() => setLinks(links.filter((_, j) => j !== i))} style={{ background: 'rgba(255,45,120,0.1)', border: 'none', color: '#FF2D78', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiX size={15} />
                    </button>
                  </div>
                ))}
                <button onClick={() => setLinks([...links, { label: '', url: '', icon: '' }])}
                  style={{ background: 'rgba(139,47,201,0.1)', border: '1.5px dashed rgba(139,47,201,0.3)', color: 'var(--purple)', padding: '10px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <FiPlus size={15} /> Add Link
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={saveInfo} style={{ alignSelf: 'flex-start' }}>
              💾 Save Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12,
  border: '1.5px solid var(--border)', background: 'var(--bg)',
  color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: 'var(--text-muted)', marginBottom: 7, letterSpacing: '0.03em',
};

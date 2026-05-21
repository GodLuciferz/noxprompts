'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trend } from '@/lib/db';
import { FiPlus, FiTrash2, FiLogOut, FiZap, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Anime', 'Ghibli', 'Realistic', 'Dark', 'Cute',
  'Neon', 'Fantasy', 'Vintage', 'Minimalist', 'Sci-Fi', 'Nature'
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Anime',
    tags: '',
    prompt: '',
    description: '',
    isTrending: false,
  });

  const login = () => {
    if (pw === '@noxstudio123') {
      setAuthed(true);
    } else {
      toast.error('Wrong password!');
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await fetch('/api/trends', { cache: 'no-store' });
      const data = await res.json();
      setTrends(Array.isArray(data) ? data : []);
    } catch {
      setTrends([]);
    }
  };

  useEffect(() => {
    if (authed) fetchTrends();
  }, [authed]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.prompt || !imageFile) {
      toast.error('Title, prompt and image required!');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      fd.append('prompt', form.prompt);
      fd.append('description', form.description);
      fd.append('isTrending', String(form.isTrending));

      const res = await fetch('/api/admin/trends', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed');

      toast.success('Trend added! 🎉');
      setForm({ title: '', category: 'Anime', tags: '', prompt: '', description: '', isTrending: false });
      setImageFile(null);
      setImagePreview('');
      fetchTrends();
    } catch {
      toast.error('Something went wrong!');
    }
    setLoading(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this trend?')) return;
    await fetch(`/api/admin/trends/${slug}`, { method: 'DELETE' });
    toast.success('Deleted!');
    fetchTrends();
  };

  if (!authed) {
    return (
      <div
        className="mesh-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="nox-card" style={{ padding: '48px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #FF2D78, #8B2FC9)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <FiZap color="white" size={24} />
          </div>
          <h1
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: '8px',
              color: 'var(--text)',
            }}
          >
            Admin Access
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '14px' }}>
            NoxPrompts Control Panel
          </p>
          <input
            type="password"
            placeholder="Enter password..."
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '12px',
              border: '2px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '15px',
              marginBottom: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button onClick={login} className="nox-btn" style={{ width: '100%', padding: '13px' }}>
            Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h1
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: '24px',
              fontWeight: 900,
            }}
          >
            <span className="gradient-text">⚡ NoxPrompts Admin</span>
          </h1>
          <button
            onClick={() => setAuthed(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '8px 16px',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          {(['add', 'manage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tag-pill ${activeTab === tab ? 'active' : ''}`}
              style={{ fontSize: '14px', padding: '8px 20px', textTransform: 'capitalize' }}
            >
              {tab === 'add' ? '➕ Add Trend' : `📋 Manage (${trends.length})`}
            </button>
          ))}
        </div>

        {/* ADD TREND */}
        {activeTab === 'add' && (
          <div className="nox-card" style={{ padding: '32px' }}>
            <h2
              style={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '24px',
                color: 'var(--text)',
              }}
            >
              Add New Trend
            </h2>

            <div style={{ display: 'grid', gap: '18px' }}>
              {/* Image Upload */}
              <div>
                <label style={labelStyle}>Example Image *</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${imagePreview ? 'var(--nox-pink)' : 'var(--border)'}`,
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: imagePreview ? 'rgba(255,45,120,0.05)' : 'var(--bg)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {imagePreview ? (
                    <Image src={imagePreview} alt="preview" fill style={{ objectFit: 'cover', borderRadius: '10px' }} />
                  ) : (
                    <div>
                      <FiUpload size={28} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                        Click to upload image
                      </p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              {/* Title */}
              <div>
                <label style={labelStyle}>Trend Title *</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Ghibli Dream Art"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input
                  style={inputStyle}
                  placeholder="ghibli, anime, nature, soft"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              {/* Prompt */}
              <div>
                <label style={labelStyle}>Prompt *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'monospace' }}
                  placeholder="Write the full AI image prompt here..."
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  placeholder="Briefly describe this style and when to use it..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Trending Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setForm({ ...form, isTrending: !form.isTrending })}
                  style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '50px',
                    border: 'none',
                    background: form.isTrending
                      ? 'linear-gradient(135deg, #FF6B00, #FFD000)'
                      : 'var(--border)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: form.isTrending ? '25px' : '3px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'white',
                      transition: 'all 0.3s',
                    }}
                  />
                </button>
                <label style={{ color: 'var(--text)', fontSize: '14px', fontWeight: 500 }}>
                  🔥 Mark as Trending
                </label>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="nox-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: '16px',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <FiPlus size={18} />
                {loading ? 'Adding...' : 'Add Trend'}
              </button>
            </div>
          </div>
        )}

        {/* MANAGE TRENDS */}
        {activeTab === 'manage' && (
          <div style={{ display: 'grid', gap: '16px' }}>
            {trends.length === 0 ? (
              <div className="nox-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No trends yet. Add your first one! 🎨
              </div>
            ) : (
              trends.map((trend) => (
                <div
                  key={trend.id}
                  className="nox-card"
                  style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}
                >
                  <div style={{ position: 'relative', width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                    <Image src={trend.imageUrl} alt={trend.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
                      {trend.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>{trend.category}</span>
                      <span>·</span>
                      <span>{trend.copyCount || 0} copies</span>
                      {trend.isTrending && <span>· 🔥 Trending</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(trend.slug)}
                    style={{
                      background: 'rgba(255,45,120,0.1)',
                      border: '1px solid rgba(255,45,120,0.3)',
                      color: 'var(--nox-pink)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

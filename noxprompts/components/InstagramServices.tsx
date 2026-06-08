'use client';
import { useEffect, useState } from 'react';
import { FiInstagram, FiChevronDown, FiShoppingCart, FiX, FiZap, FiInfo } from 'react-icons/fi';

interface SMMService {
  service: number;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  category: string;
  description?: string;
}

export default function InstagramServices() {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category & service selection
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<SMMService | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  // Order form
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderMsg, setOrderMsg] = useState('');

  // Derived data
  const categories = Array.from(new Set(services.map(s => s.category))).filter(Boolean);
  const catServices = services.filter(s => s.category === selectedCategory);

  useEffect(() => {
    fetch('/api/smm/instagram')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setServices(d);
          if (d.length > 0) {
            const firstCat = d[0].category;
            setSelectedCategory(firstCat);
            setSelectedService(d[0]);
            setQuantity(parseInt(d[0].min) || 10);
          }
        } else {
          setError('Could not load services.');
        }
      })
      .catch(() => setError('Network error. Try again.'))
      .finally(() => setLoading(false));
  }, []);

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCatOpen(false);
    const first = services.find(s => s.category === cat);
    if (first) {
      setSelectedService(first);
      setQuantity(parseInt(first.min) || 10);
    }
  };

  const selectService = (svc: SMMService) => {
    setSelectedService(svc);
    setSvcOpen(false);
    setQuantity(parseInt(svc.min) || 10);
    setOrderStatus('idle');
  };

  const handleOrder = async () => {
    if (!selectedService || !link || quantity < parseInt(selectedService.min)) return;
    setOrderStatus('loading');
    try {
      const res = await fetch('/api/smm/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: selectedService.service, link, quantity }),
      });
      const data = await res.json();
      if (data.order) {
        setOrderStatus('success');
        setOrderMsg(`Order #${data.order} placed successfully!`);
      } else {
        setOrderStatus('error');
        setOrderMsg(data.error || 'Order failed. Try again.');
      }
    } catch {
      setOrderStatus('error');
      setOrderMsg('Network error. Please try again.');
    }
  };

  const priceINR = selectedService && quantity
    ? ((parseFloat(selectedService.rate) / 1000) * quantity * 83).toFixed(2)
    : '0.00';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text)',
    display: 'block',
    marginBottom: 8,
    letterSpacing: '0.02em',
  };

  const dropdownBtnStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    textAlign: 'left' as const,
  };

  const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    zIndex: 50,
    maxHeight: 280,
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  };

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 80px' }}>

      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <FiInstagram size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{
            fontFamily: 'Unbounded,sans-serif', fontSize: 'clamp(16px,2.2vw,22px)',
            fontWeight: 700, color: 'var(--text)', margin: 0,
          }}>Instagram Services</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
            {loading ? 'Loading services...' : `${services.length} services · Powered by EasySMM`}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[180, 60, 200, 60].map((h, i) => (
            <div key={i} style={{
              height: h, borderRadius: 12, background: 'var(--bg-card)',
              border: '1px solid var(--border)', opacity: 0.6,
            }} />
          ))}
        </div>
      )}

      {/* Main Order Form */}
      {!loading && !error && services.length > 0 && (
        <div className="card" style={{ borderRadius: 20, padding: '28px 24px', maxWidth: 760 }}>

          {/* 1. Category */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Category</label>
            <div style={{ position: 'relative' }}>
              <button style={dropdownBtnStyle} onClick={() => { setCatOpen(!catOpen); setSvcOpen(false); }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <FiInstagram size={16} color="#dc2743" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedCategory || 'Select category...'}
                  </span>
                </span>
                <FiChevronDown size={16} color="var(--text-muted)" style={{
                  flexShrink: 0,
                  transform: catOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }} />
              </button>
              {catOpen && (
                <div style={dropdownMenuStyle}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => selectCategory(cat)} style={{
                      width: '100%', background: cat === selectedCategory ? 'rgba(139,47,201,0.1)' : 'none',
                      border: 'none', color: cat === selectedCategory ? 'var(--purple)' : 'var(--text)',
                      padding: '11px 16px', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 13, fontWeight: cat === selectedCategory ? 700 : 400,
                      display: 'flex', alignItems: 'center', gap: 8,
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <FiInstagram size={13} color="#dc2743" />
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Service */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Service</label>
            <div style={{ position: 'relative' }}>
              <button style={dropdownBtnStyle} onClick={() => { setSvcOpen(!svcOpen); setCatOpen(false); }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  {selectedService && (
                    <span style={{
                      background: 'var(--purple)', color: '#fff',
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      flexShrink: 0,
                    }}>{selectedService.service}</span>
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedService ? selectedService.name : 'Select service...'}
                  </span>
                </span>
                <FiChevronDown size={16} color="var(--text-muted)" style={{
                  flexShrink: 0,
                  transform: svcOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }} />
              </button>
              {svcOpen && (
                <div style={dropdownMenuStyle}>
                  {catServices.map(svc => (
                    <button key={svc.service} onClick={() => selectService(svc)} style={{
                      width: '100%',
                      background: selectedService?.service === svc.service ? 'rgba(139,47,201,0.08)' : 'none',
                      border: 'none',
                      color: selectedService?.service === svc.service ? 'var(--purple)' : 'var(--text)',
                      padding: '10px 16px', textAlign: 'left', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 13,
                      display: 'flex', alignItems: 'center', gap: 10,
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{
                        background: selectedService?.service === svc.service ? 'var(--purple)' : 'rgba(139,47,201,0.2)',
                        color: selectedService?.service === svc.service ? '#fff' : 'var(--purple)',
                        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                        flexShrink: 0, minWidth: 32, textAlign: 'center',
                      }}>{svc.service}</span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {svc.name}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--pink)', flexShrink: 0, fontWeight: 700 }}>
                        ₹{(parseFloat(svc.rate) * 83 / 1000).toFixed(3)}/1K
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Description */}
          {selectedService?.description && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiInfo size={14} /> Description
                </span>
              </label>
              <div style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
                fontSize: 13, color: 'var(--text)', lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
                {selectedService.description}
              </div>
            </div>
          )}

          {/* Service Stats Pills */}
          {selectedService && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                ['⚡ Type', selectedService.type],
                ['📉 Min', Number(selectedService.min).toLocaleString()],
                ['📈 Max', Number(selectedService.max).toLocaleString()],
                ['💰 Rate', `₹${(parseFloat(selectedService.rate) * 83 / 1000).toFixed(4)}/1K`],
              ].map(([label, val]) => (
                <div key={label} style={{
                  background: 'rgba(139,47,201,0.08)',
                  border: '1px solid rgba(139,47,201,0.2)',
                  borderRadius: 8, padding: '6px 12px',
                  fontSize: 12,
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* 4. Link */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Link</label>
            <input
              type="url"
              placeholder="https://instagram.com/yourusername"
              value={link}
              onChange={e => setLink(e.target.value)}
              style={inputStyle}
            />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              {selectedService?.type === 'Default'
                ? '↑ Enter your Instagram username or profile URL'
                : '↑ Enter the post/reel/story URL'}
            </p>
          </div>

          {/* 5. Quantity */}
          {selectedService && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>
                Quantity
                <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
                  (Min: {Number(selectedService.min).toLocaleString()} / Max: {Number(selectedService.max).toLocaleString()})
                </span>
              </label>
              <input
                type="number"
                min={parseInt(selectedService.min)}
                max={parseInt(selectedService.max)}
                value={quantity}
                onChange={e => setQuantity(Math.min(parseInt(selectedService.max), Math.max(parseInt(selectedService.min), parseInt(e.target.value) || 0)))}
                style={inputStyle}
              />
            </div>
          )}

          {/* Price & Order */}
          {selectedService && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,45,120,0.06), rgba(139,47,201,0.06))',
              border: '1px solid rgba(255,45,120,0.2)',
              borderRadius: 14, padding: '16px 20px', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Estimated Total</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--pink)', margin: '2px 0 0', fontFamily: 'Unbounded,sans-serif' }}>
                  ₹{priceINR}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>For {quantity.toLocaleString()} units</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                    <FiZap size={10} /> Instant delivery
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Status Messages */}
          {orderStatus === 'success' && (
            <div style={{
              background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)',
              borderRadius: 12, padding: '14px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 10, color: '#00C864', fontSize: 14, fontWeight: 600,
            }}>
              ✅ {orderMsg}
            </div>
          )}
          {orderStatus === 'error' && (
            <div style={{
              background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.3)',
              borderRadius: 12, padding: '14px 16px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 10, color: 'var(--pink)', fontSize: 14, fontWeight: 600,
            }}>
              ❌ {orderMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            className="btn-primary"
            onClick={handleOrder}
            disabled={orderStatus === 'loading' || !link || !selectedService}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, fontSize: 16, padding: '14px 28px',
              opacity: (!link || !selectedService) ? 0.5 : 1,
              cursor: (!link || !selectedService) ? 'not-allowed' : 'pointer',
            }}
          >
            {orderStatus === 'loading' ? (
              <>⏳ Processing Order...</>
            ) : (
              <><FiShoppingCart size={18} /> Place Order</>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

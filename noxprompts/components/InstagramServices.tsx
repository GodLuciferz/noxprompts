'use client';
import { useEffect, useState } from 'react';
import { FiInstagram, FiChevronDown, FiAlertCircle, FiZap, FiInfo, FiLock, FiLink, FiUser } from 'react-icons/fi';
import { supabaseBrowser } from '@/lib/supabase-client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const MARKUP = 1.30;

interface SMMService {
  service: number;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  category: string;
  description?: string;
  refill?: boolean;
  cancel?: boolean;
}

// Smart link detection based on service name/category
function getLinkInfo(svc: SMMService | null): { placeholder: string; hint: string; icon: React.ReactNode } {
  if (!svc) return { placeholder: 'https://instagram.com/...', hint: 'Enter the link', icon: <FiLink size={14}/> };
  
  const name = (svc.name + ' ' + svc.category).toLowerCase();
  
  if (name.includes('follower') || name.includes('username') || name.includes('profile') || name.includes('reach') || name.includes('indian mix')) {
    return {
      placeholder: 'https://instagram.com/yourusername',
      hint: '👤 Enter your Instagram profile URL or username',
      icon: <FiUser size={14} color="#8B2FC9"/>,
    };
  }
  if (name.includes('reel') || name.includes('video') || name.includes('view') || name.includes('igtv')) {
    return {
      placeholder: 'https://instagram.com/reel/ABC123/',
      hint: '🎬 Enter the Reel or Video URL',
      icon: <FiLink size={14} color="#FF2D78"/>,
    };
  }
  if (name.includes('story')) {
    return {
      placeholder: 'https://instagram.com/stories/username/',
      hint: '📱 Enter the Story URL',
      icon: <FiLink size={14} color="#FF2D78"/>,
    };
  }
  if (name.includes('like') || name.includes('comment') || name.includes('save') || name.includes('post')) {
    return {
      placeholder: 'https://instagram.com/p/ABC123/',
      hint: '📸 Enter the Post URL',
      icon: <FiLink size={14} color="#FF2D78"/>,
    };
  }
  return {
    placeholder: 'https://instagram.com/...',
    hint: '🔗 Enter the Instagram link',
    icon: <FiLink size={14} color="var(--text-muted)"/>,
  };
}

export default function InstagramServices() {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<SMMService | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [qtyError, setQtyError] = useState('');
  const [payStatus, setPayStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [payError, setPayError] = useState('');

  const categories = Array.from(new Set(services.map(s => s.category))).filter(Boolean);
  const catServices = services.filter(s => s.category === selectedCategory);
  const linkInfo = getLinkInfo(selectedService);

  const markedRate = (rate: string) => parseFloat(rate) * MARKUP;
  const priceFor = (rate: string, qty: number) => ((markedRate(rate) / 1000) * qty).toFixed(2);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

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
        } else setError('Could not load services.');
      })
      .catch(() => setError('Network error. Try again.'))
      .finally(() => setLoading(false));
  }, []);

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat); setCatOpen(false);
    const first = services.find(s => s.category === cat);
    if (first) { setSelectedService(first); setQuantity(parseInt(first.min) || 10); setQtyError(''); setLink(''); }
  };

  const selectService = (svc: SMMService) => {
    setSelectedService(svc); setSvcOpen(false);
    setQuantity(parseInt(svc.min) || 10); setQtyError(''); setPayStatus('idle'); setLink('');
  };

  const handleQuantityChange = (val: string) => {
    const num = parseInt(val) || 0;
    setQuantity(num);
    if (!selectedService) return;
    const min = parseInt(selectedService.min);
    const max = parseInt(selectedService.max);
    if (num < min) setQtyError(`Minimum order is ${min.toLocaleString()}`);
    else if (num > max) setQtyError(`Maximum order is ${max.toLocaleString()}`);
    else setQtyError('');
  };

  const handlePayment = async () => {
    if (!selectedService || !link || qtyError) return;

    // Check login first
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      await supabaseBrowser.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `https://www.noxzone111.online/services` },
      });
      return;
    }
    const price = priceFor(selectedService.rate, quantity);
    setPayStatus('loading'); setPayError('');

    try {
      // 1. Create Razorpay order via backend
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'smm',
          serviceId: selectedService.service,
          serviceName: selectedService.name,
          quantity,
          link,
          price,
          userId: user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();

      if (!data.orderId) {
        setPayStatus('error');
        setPayError(data.error || 'Payment initiation failed.');
        return;
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'NoxPrompts',
        description: `SMM: ${selectedService.name} x${quantity}`,
        order_id: data.orderId,
        prefill: {
          email: user.email || '',
        },
        theme: { color: '#8B2FC9' },
        handler: async function (response: any) {
          // 3. Verify payment signature
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.paid) {
              setPayStatus('error');
              setPayError('Payment verification failed. Please contact support.');
              return;
            }

            // 4. Redirect to success page (same params smm-success page expects)
            const successUrl = `https://www.noxzone111.online/smm/success?oid=${response.razorpay_payment_id}&sid=${selectedService.service}&qty=${quantity}&lnk=${encodeURIComponent(link)}&amt=${price}`;
            window.location.href = successUrl;
          } catch {
            setPayStatus('error');
            setPayError('Verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setPayStatus('idle');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setPayStatus('idle');
    } catch {
      setPayStatus('error'); setPayError('Network error. Please try again.');
    }
  };

  const canOrder = link && !qtyError && quantity > 0 && selectedService && payStatus !== 'loading';

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%', background: 'var(--bg)',
    border: `1.5px solid ${hasError ? '#FF2D78' : 'var(--border)'}`,
    color: 'var(--text)', padding: '13px 16px', borderRadius: 12,
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
    display: 'block', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase',
  };

  const dropdownBtnStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)',
    color: 'var(--text)', padding: '13px 16px', borderRadius: 12,
    fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
    textAlign: 'left' as const, boxSizing: 'border-box' as const,
  };

  return (
    <section id="instagram-services">
      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div><p>{error}</p>
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[180, 60, 200, 60].map((h, i) => (
            <div key={i} style={{ height: h, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: 0.5 }} />
          ))}
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="card" style={{ borderRadius: 20, padding: 'clamp(16px, 4vw, 28px)', width: '100%', boxSizing: 'border-box' }}>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Category</label>
            <div style={{ position: 'relative' }}>
              <button style={dropdownBtnStyle} onClick={() => { setCatOpen(!catOpen); setSvcOpen(false); }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                  <FiInstagram size={15} color="#dc2743" style={{ flexShrink: 0 }} />
                  <span style={{ 
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'block', minWidth: 0,
                  }}>
                    {selectedCategory || 'Select category...'}
                  </span>
                </span>
                <FiChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0, transform: catOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {catOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  borderRadius: 12, zIndex: 50, maxHeight: 280, overflowY: 'auto',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => selectCategory(cat)} style={{
                      width: '100%', background: cat === selectedCategory ? 'rgba(139,47,201,0.1)' : 'none',
                      border: 'none', color: cat === selectedCategory ? 'var(--purple)' : 'var(--text)',
                      padding: '11px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: 13, fontWeight: cat === selectedCategory ? 700 : 400,
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                      borderBottom: '1px solid var(--border)', boxSizing: 'border-box',
                      whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4,
                    }}>
                      <FiInstagram size={13} color="#dc2743" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Service */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Service</label>
            <div style={{ position: 'relative' }}>
              <button style={dropdownBtnStyle} onClick={() => { setSvcOpen(!svcOpen); setCatOpen(false); }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                  {selectedService && (
                    <span style={{
                      background: 'var(--purple)', color: '#fff',
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, flexShrink: 0,
                    }}>{selectedService.service}</span>
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', minWidth: 0 }}>
                    {selectedService ? selectedService.name : 'Select service...'}
                  </span>
                </span>
                <FiChevronDown size={16} color="var(--text-muted)" style={{ flexShrink: 0, transform: svcOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {svcOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  borderRadius: 12, zIndex: 50, maxHeight: 320, overflowY: 'auto',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}>
                  {catServices.map(svc => {
                    const displayRate = markedRate(svc.rate).toFixed(2);
                    const isSelected = selectedService?.service === svc.service;
                    return (
                      <button key={svc.service} onClick={() => selectService(svc)} style={{
                        width: '100%', background: isSelected ? 'rgba(139,47,201,0.08)' : 'none',
                        border: 'none', color: isSelected ? 'var(--purple)' : 'var(--text)',
                        padding: '10px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                        fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 10,
                        borderBottom: '1px solid var(--border)', boxSizing: 'border-box',
                      }}>
                        <span style={{
                          background: isSelected ? 'var(--purple)' : 'rgba(139,47,201,0.2)',
                          color: isSelected ? '#fff' : 'var(--purple)',
                          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                          flexShrink: 0, minWidth: 32, textAlign: 'center', marginTop: 2,
                        }}>{svc.service}</span>
                        <span style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}>
                          {svc.name}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--pink)', flexShrink: 0, fontWeight: 700, whiteSpace: 'nowrap', marginTop: 2 }}>
                          ₹{displayRate}/1K
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {selectedService?.description && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiInfo size={12} /> Description</span></label>
              <div style={{
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
                fontSize: 13, color: 'var(--text)', lineHeight: 1.7,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 180, overflowY: 'auto',
              }}>
                {selectedService.description}
              </div>
            </div>
          )}

          {/* Stats Pills */}
          {selectedService && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                ['⚡', 'Type', selectedService.type],
                ['📉', 'Min', Number(selectedService.min).toLocaleString()],
                ['📈', 'Max', Number(selectedService.max).toLocaleString()],
                ['💰', 'Rate', `₹${markedRate(selectedService.rate).toFixed(2)}/1K`],
                ...(selectedService.refill ? [['🔄', 'Refill', 'Available']] : []),
              ].map(([icon, lbl, val]) => (
                <div key={lbl} style={{
                  background: 'rgba(139,47,201,0.08)', border: '1px solid rgba(139,47,201,0.2)',
                  borderRadius: 8, padding: '6px 12px', fontSize: 12,
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>{icon} {lbl}: </span>
                  <span style={{ color: lbl === 'Refill' ? '#00C864' : 'var(--text)', fontWeight: 700 }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Smart Link Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {linkInfo.icon} Link
              </span>
            </label>
            <input
              type="url"
              placeholder={linkInfo.placeholder}
              value={link}
              onChange={e => setLink(e.target.value)}
              style={inputStyle()}
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              {linkInfo.hint}
            </p>
          </div>

          {/* Quantity */}
          {selectedService && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>
                Quantity
                <span style={{ fontWeight: 400, marginLeft: 8, textTransform: 'none' }}>
                  (Min: {Number(selectedService.min).toLocaleString()} / Max: {Number(selectedService.max).toLocaleString()})
                </span>
              </label>
              <input
                type="number"
                min={parseInt(selectedService.min)}
                max={parseInt(selectedService.max)}
                value={quantity}
                onChange={e => handleQuantityChange(e.target.value)}
                style={inputStyle(!!qtyError)}
              />
              {qtyError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FF2D78', fontSize: 12, fontWeight: 600, marginTop: 8 }}>
                  <FiAlertCircle size={13} />{qtyError}
                </div>
              )}
            </div>
          )}

          {/* Price Summary */}
          {selectedService && !qtyError && quantity > 0 && (
            <div style={{
              background: 'linear-gradient(135deg,rgba(255,45,120,0.06),rgba(139,47,201,0.06))',
              border: '1px solid rgba(255,45,120,0.2)',
              borderRadius: 14, padding: '16px 20px', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Total Payable</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--pink)', margin: '2px 0 0', fontFamily: 'Unbounded,sans-serif' }}>
                  ₹{priceFor(selectedService.rate, quantity)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>For {quantity.toLocaleString()} units</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  <FiZap size={10} /> Instant delivery
                </p>
              </div>
            </div>
          )}

          {payStatus === 'error' && (
            <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, color: 'var(--pink)', fontSize: 14, fontWeight: 600 }}>
              ❌ {payError}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handlePayment}
            disabled={!canOrder}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, fontSize: 16, padding: '14px 28px',
              opacity: canOrder ? 1 : 0.45, cursor: canOrder ? 'pointer' : 'not-allowed',
            }}
          >
            {payStatus === 'loading'
              ? '⏳ Initiating Payment...'
              : <><FiLock size={16} /> Pay & Place Order — ₹{selectedService && !qtyError ? priceFor(selectedService.rate, quantity) : '0'}</>
            }
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
            🔒 Secure payment via Razorpay · UPI, Cards, Net Banking accepted
          </p>
        </div>
      )}
    </section>
  );
}

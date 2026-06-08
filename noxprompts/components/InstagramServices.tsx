'use client';
import { useEffect, useState } from 'react';
import { FiInstagram, FiChevronDown, FiChevronUp, FiShoppingCart, FiX, FiZap } from 'react-icons/fi';

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

interface OrderForm {
  service: SMMService;
  link: string;
  quantity: number;
}

export default function InstagramServices() {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [order, setOrder] = useState<OrderForm | null>(null);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [search, setSearch] = useState('');

  // Group by sub-category
  const grouped = services
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .reduce<Record<string, SMMService[]>>((acc, s) => {
      const key = s.category || 'General';
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});

  useEffect(() => {
    fetch('/api/smm/instagram')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setServices(d);
        else setError('Could not load services.');
      })
      .catch(() => setError('Network error. Try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const handleOrder = async () => {
    if (!order) return;
    if (!order.link || order.quantity < parseInt(order.service.min)) return;
    setOrderStatus('loading');
    try {
      const res = await fetch('/api/smm/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: order.service.service,
          link: order.link,
          quantity: order.quantity,
        }),
      });
      const data = await res.json();
      if (data.order) setOrderStatus('success');
      else setOrderStatus('error');
    } catch {
      setOrderStatus('error');
    }
  };

  const totalPrice = order
    ? ((parseFloat(order.service.rate) / 1000) * order.quantity).toFixed(4)
    : '0';

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiInstagram size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{
              fontFamily: 'Unbounded,sans-serif', fontSize: 'clamp(15px,2.2vw,20px)',
              fontWeight: 700, color: 'var(--text)', margin: 0,
            }}>Instagram Services</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              {services.length > 0 ? `${services.length} services available` : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '8px 16px',
            borderRadius: 50,
            fontSize: 13,
            outline: 'none',
            width: 220,
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ height: 100, opacity: 0.5, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {/* Grouped Services */}
      {!loading && !error && Object.entries(grouped).map(([groupName, items]) => (
        <div key={groupName} style={{ marginBottom: 32 }}>
          <h3 style={{
            fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)',
            marginBottom: 12, paddingLeft: 4,
          }}>{groupName}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(s => (
              <div key={s.service} className="card" style={{
                borderRadius: 14,
                transition: 'all 0.2s',
                overflow: 'visible',
              }}>
                {/* Row */}
                <div
                  onClick={() => setExpanded(expanded === s.service ? null : s.service)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', cursor: 'pointer', gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 600, color: 'var(--text)',
                      margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{s.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiZap size={10} />
                      {s.type} &nbsp;·&nbsp; Min {s.min} &nbsp;·&nbsp; Max {s.max}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{
                      background: 'rgba(255,45,120,0.1)', color: 'var(--pink)',
                      border: '1px solid rgba(255,45,120,0.2)',
                      fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 50,
                    }}>
                      ₹{(parseFloat(s.rate) * 83 / 1000).toFixed(3)}/1K
                    </span>
                    {expanded === s.service ? <FiChevronUp size={16} color="var(--text-muted)" /> : <FiChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === s.service && (
                  <div style={{
                    borderTop: '1px solid var(--border)',
                    padding: '16px 18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 12,
                  }}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {[
                        ['Service ID', s.service],
                        ['Type', s.type],
                        ['Min Order', s.min],
                        ['Max Order', s.max],
                        ['Rate (USD/1K)', s.rate],
                      ].map(([label, val]) => (
                        <div key={label as string}>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{label}</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => setOrder({ service: s, link: '', quantity: parseInt(s.min) })}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '10px 22px' }}
                    >
                      <FiShoppingCart size={14} /> Order Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {!loading && !error && Object.keys(grouped).length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
          <p>No services found for &quot;{search}&quot;</p>
        </div>
      )}

      {/* Order Modal */}
      {order && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: 480, borderRadius: 20,
            padding: '28px 24px', position: 'relative',
          }}>
            <button onClick={() => { setOrder(null); setOrderStatus('idle'); }} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
            }}>
              <FiX size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiInstagram size={16} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Place Order</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{order.service.name}</p>
              </div>
            </div>

            {orderStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>Order Placed!</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Your order has been submitted successfully.</p>
                <button className="btn-primary" onClick={() => { setOrder(null); setOrderStatus('idle'); }} style={{ marginTop: 16, fontSize: 13 }}>Close</button>
              </div>
            ) : orderStatus === 'error' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>Order Failed</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Something went wrong. Please try again.</p>
                <button className="btn-primary" onClick={() => setOrderStatus('idle')} style={{ marginTop: 16, fontSize: 13 }}>Try Again</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Instagram Profile / Post URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourprofile"
                    value={order.link}
                    onChange={e => setOrder({ ...order, link: e.target.value })}
                    style={{
                      width: '100%', background: 'var(--bg)',
                      border: '1px solid var(--border)', color: 'var(--text)',
                      padding: '10px 14px', borderRadius: 10, fontSize: 14,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Quantity (Min: {order.service.min} / Max: {order.service.max})
                  </label>
                  <input
                    type="number"
                    min={parseInt(order.service.min)}
                    max={parseInt(order.service.max)}
                    value={order.quantity}
                    onChange={e => setOrder({ ...order, quantity: parseInt(e.target.value) || parseInt(order.service.min) })}
                    style={{
                      width: '100%', background: 'var(--bg)',
                      border: '1px solid var(--border)', color: 'var(--text)',
                      padding: '10px 14px', borderRadius: 10, fontSize: 14,
                      outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Price Summary */}
                <div style={{
                  background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)',
                  borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Estimated Cost</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--pink)' }}>
                    ₹{(parseFloat(totalPrice) * 83).toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleOrder}
                  disabled={orderStatus === 'loading' || !order.link}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, fontSize: 15,
                    opacity: !order.link ? 0.6 : 1, cursor: !order.link ? 'not-allowed' : 'pointer',
                  }}
                >
                  {orderStatus === 'loading' ? (
                    <>Processing...</>
                  ) : (
                    <><FiShoppingCart size={16} /> Confirm Order</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

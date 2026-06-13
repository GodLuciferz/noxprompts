'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { FiRefreshCw, FiLogOut, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface SMMOrder {
  id: string;
  cashfree_order_id: string;
  easysmm_order_id: string;
  service_name: string;
  link: string;
  quantity: number;
  amount: number;
  status: string;
  refill_eligible: boolean;
  created_at: string;
}

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<SMMOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [refilling, setRefilling] = useState<string | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchOrders(user);
      else setLoading(false);
    });
  }, []);

  const fetchOrders = async (u: User) => {
    setLoading(true);
    try {
      const res = await fetch('/api/smm/my-orders', {
        headers: {
          'x-user-id': u.id,
          'x-user-email': u.email || '',
        },
      });
      const data = await res.json();
      const ordersData = Array.isArray(data) ? data : [];
      setOrders(ordersData);

      // Auto-sync status from EasySMM for pending/in-progress orders
      const toSync = ordersData
        .filter((o: SMMOrder) => o.easysmm_order_id && o.status !== 'completed' && o.status !== 'cancelled')
        .map((o: SMMOrder) => o.easysmm_order_id);

      if (toSync.length > 0) {
        syncStatuses(toSync, ordersData);
      }
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  const syncStatuses = async (orderIds: string[], currentOrders: SMMOrder[]) => {
    setSyncing(true);
    try {
      const res = await fetch('/api/smm/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds }),
      });
      const result = await res.json();

      if (result.statusData) {
        // Update orders locally with new statuses
        setOrders(currentOrders.map(order => {
          const updated = result.statusData[order.easysmm_order_id];
          if (updated?.status) {
            return { ...order, status: updated.status.toLowerCase() };
          }
          return order;
        }));
      }
    } catch {}
    setSyncing(false);
  };

  const handleGoogleLogin = async () => {
    await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.noxzone111.online/orders' },
    });
  };

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    setUser(null);
    setOrders([]);
  };

  const handleRefill = async (order: SMMOrder) => {
    setRefilling(order.easysmm_order_id);
    try {
      const res = await fetch('/api/smm/refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: parseInt(order.easysmm_order_id) }),
      });
      const data = await res.json();
      if (data.refill) alert(`✅ Refill requested! ID: ${data.refill}`);
      else alert('❌ Refill failed: ' + (data.error || 'Unknown error'));
    } catch { alert('Network error'); }
    setRefilling(null);
  };

  const statusIcon = (s: string) => {
    if (s === 'completed') return <FiCheckCircle size={14} color="#00C864" />;
    if (s === 'canceled' || s === 'cancelled') return <FiXCircle size={14} color="#FF2D78" />;
    if (s === 'in progress' || s === 'processing') return <FiRefreshCw size={14} color="#8B2FC9" />;
    return <FiClock size={14} color="var(--text-muted)" />;
  };

  const statusColor = (s: string) => {
    if (s === 'completed') return '#00C864';
    if (s === 'canceled' || s === 'cancelled') return '#FF2D78';
    if (s === 'in progress' || s === 'processing') return '#8B2FC9';
    return 'var(--text-muted)';
  };

  if (!user && !loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 24, padding: '48px 36px', maxWidth: 400, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
        <h1 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 22, fontWeight: 900, margin: '0 0 10px' }}>Order History</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 28px' }}>
          Login with Google to view your SMM order history
        </p>
        <button onClick={handleGoogleLogin} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, padding: '14px 24px', borderRadius: 50, border: '1.5px solid var(--border)',
          background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <Link href="/services" style={{ display: 'block', marginTop: 16, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
          ← Back to Services
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 900, margin: '0 0 4px' }}>
              📦 My Orders
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              {user?.email}
              {syncing && <span style={{ marginLeft: 10, color: 'var(--purple)', fontSize: 11 }}>⟳ Syncing status...</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => user && fetchOrders(user)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 50, border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text)', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            }}>
              <FiRefreshCw size={13} /> Refresh
            </button>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 50, border: '1px solid rgba(255,45,120,0.3)',
              background: 'rgba(255,45,120,0.06)', color: 'var(--pink)', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            }}>
              <FiLogOut size={13} /> Logout
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 110, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: 0.5 }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
            <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>No orders yet</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px' }}>Place your first Instagram order!</p>
            <Link href="/services" className="btn-primary" style={{ padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontSize: 14 }}>
              Browse Services →
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.service_name || `Service #${order.easysmm_order_id}`}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      🔗 {order.link}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, background: 'rgba(139,47,201,0.1)', border: '1px solid rgba(139,47,201,0.2)', borderRadius: 6, padding: '3px 10px', color: 'var(--purple)', fontWeight: 700 }}>
                        {order.quantity?.toLocaleString()} units
                      </span>
                      {order.amount > 0 && (
                        <span style={{ fontSize: 11, background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: 6, padding: '3px 10px', color: 'var(--pink)', fontWeight: 700 }}>
                          ₹{order.amount}
                        </span>
                      )}
                      <span style={{ fontSize: 11, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 10px', color: 'var(--text-muted)' }}>
                        ID: #{order.easysmm_order_id}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: statusColor(order.status) }}>
                      {statusIcon(order.status)}
                      {order.status}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {order.refill_eligible && (
                      <button
                        onClick={() => handleRefill(order)}
                        disabled={refilling === order.easysmm_order_id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                          background: 'rgba(0,200,100,0.1)', border: '1px solid rgba(0,200,100,0.3)',
                          color: '#00C864', cursor: 'pointer', fontFamily: 'inherit',
                          opacity: refilling === order.easysmm_order_id ? 0.6 : 1,
                        }}
                      >
                        <FiRefreshCw size={11} />
                        {refilling === order.easysmm_order_id ? 'Requesting...' : 'Refill'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

function SMMSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id') || '';
  const serviceId = params.get('service') || '';
  const link = params.get('link') || '';
  const quantity = params.get('quantity') || '';

  const [status, setStatus] = useState<'verifying' | 'placing' | 'success' | 'error'>('verifying');
  const [smmOrderId, setSmmOrderId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!orderId || !serviceId || !link || !quantity) {
      setStatus('error');
      setErrorMsg('Missing order details.');
      return;
    }

    const placeOrder = async () => {
      try {
        // Step 1: Verify Cashfree payment
        setStatus('verifying');
        const verifyRes = await fetch(`/api/cashfree/verify?order_id=${orderId}`);
        const verifyData = await verifyRes.json();

        if (!verifyData.paid) {
          setStatus('error');
          setErrorMsg('Payment not confirmed. Please contact support.');
          return;
        }

        // Step 2: Place EasySMM order
        setStatus('placing');
        const orderRes = await fetch('/api/smm/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service: serviceId, link, quantity: parseInt(quantity) }),
        });
        const orderData = await orderRes.json();

        if (orderData.order) {
          setSmmOrderId(orderData.order);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(orderData.error || 'Order placement failed. Please contact support with your payment ID.');
        }
      } catch {
        setStatus('error');
        setErrorMsg('Network error. Please contact support.');
      }
    };

    placeOrder();
  }, [orderId, serviceId, link, quantity]);

  const statusConfig = {
    verifying: { icon: '🔍', title: 'Verifying Payment...', color: '#8B2FC9', msg: 'Checking your payment status' },
    placing: { icon: '⚡', title: 'Placing Your Order...', color: '#FF2D78', msg: 'Sending order to service provider' },
    success: { icon: '🎉', title: 'Order Placed!', color: '#00C864', msg: '' },
    error: { icon: '❌', title: 'Something Went Wrong', color: '#FF2D78', msg: errorMsg },
  };

  const cfg = statusConfig[status];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '20px',
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1.5px solid var(--border)',
        borderRadius: 24, padding: '40px 32px', maxWidth: 440, width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{cfg.icon}</div>

        <h1 style={{
          fontFamily: 'Unbounded, sans-serif', fontSize: 22, fontWeight: 900,
          color: cfg.color, margin: '0 0 10px',
        }}>{cfg.title}</h1>

        {(status === 'verifying' || status === 'placing') && (
          <div style={{ margin: '20px auto', width: 40, height: 40 }}>
            <div style={{
              width: 40, height: 40, border: `3px solid rgba(139,47,201,0.2)`,
              borderTop: `3px solid ${cfg.color}`,
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px' }}>
          {cfg.msg}
        </p>

        {status === 'success' && (
          <div style={{
            background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.2)',
            borderRadius: 14, padding: '16px', marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>EasySMM Order ID</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#00C864', margin: 0, fontFamily: 'Unbounded, sans-serif' }}>
              #{smmOrderId}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '8px 0 0' }}>
              Save this ID to track your order
            </p>
          </div>
        )}

        {orderId && (
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>
            Payment ID: {orderId}
          </p>
        )}

        <Link href="/#instagram-services" style={{
          display: 'inline-block', padding: '12px 28px', borderRadius: 50,
          background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
          color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
        }}>
          ← Back to Services
        </Link>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function SMMSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    }>
      <SMMSuccessContent />
    </Suspense>
  );
}

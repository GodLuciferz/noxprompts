'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiInstagram, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

export default function SMMSuccessPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [smmOrderId, setSmmOrderId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const cfOrderId = params.get('order_id');
    const serviceId = params.get('cf_service');
    const link = params.get('cf_link');
    const qty = params.get('cf_qty');

    if (!cfOrderId || !serviceId || !link || !qty) {
      setStatus('error');
      setMessage('Missing order details.');
      return;
    }

    // Verify payment with Cashfree then place EasySMM order
    const placeOrder = async () => {
      try {
        // 1. Verify payment status
        const verifyRes = await fetch(`/api/smm/verify?order_id=${cfOrderId}`);
        const verifyData = await verifyRes.json();

        if (!verifyData.paid) {
          setStatus('error');
          setMessage(verifyData.error || 'Payment not confirmed. Contact support.');
          return;
        }

        // 2. Place EasySMM order
        const orderRes = await fetch('/api/smm/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service: parseInt(serviceId),
            link: decodeURIComponent(link),
            quantity: parseInt(qty),
          }),
        });
        const orderData = await orderRes.json();

        if (orderData.order) {
          setStatus('success');
          setSmmOrderId(orderData.order);
        } else {
          setStatus('error');
          setMessage('Payment done but order failed. Contact support with Cashfree Order ID: ' + cfOrderId);
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Contact support.');
      }
    };

    placeOrder();
  }, [params]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg)',
    }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', borderRadius: 24, padding: '40px 32px', textAlign: 'center' }}>

        {/* Instagram icon */}
        <div style={{
          width: 60, height: 60, borderRadius: 18, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FiInstagram size={28} color="#fff" />
        </div>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⏳</div>
            <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Processing your order...
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Verifying payment and placing your Instagram order.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <FiCheckCircle size={48} color="#00C864" style={{ marginBottom: 16 }} />
            <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Order Placed! 🎉
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Your Instagram service has been ordered successfully. It will start within the service&apos;s listed timeframe.
            </p>
            <div style={{
              background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.2)',
              borderRadius: 12, padding: '12px 20px', marginBottom: 24,
            }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>SMM Order ID</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#00C864', margin: '4px 0 0' }}>#{smmOrderId}</p>
            </div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', fontSize: 15 }}>
                Back to Home
              </button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <FiXCircle size={48} color="#FF2D78" style={{ marginBottom: 16 }} />
            <h2 style={{ fontFamily: 'Unbounded,sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              {message}
            </p>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', fontSize: 15 }}>
                Back to Home
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

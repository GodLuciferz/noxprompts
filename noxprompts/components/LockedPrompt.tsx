"use client";
import { useState } from "react";

interface LockedPromptProps {
  promptSlug: string;
  promptName: string;
  price: number;
  previewText: string;
}

export default function LockedPrompt({
  promptSlug,
  promptName,
  price,
  previewText,
}: LockedPromptProps) {
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptSlug,
          promptName,
          price,
          userEmail: "",
          userName: "",
        }),
      });
      const data = await res.json();
      const { payuUrl, params } = data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payuUrl;
      form.style.display = "none";

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("PayU error:", err);
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', borderRadius: 12, border: '1.5px solid rgba(139,47,201,0.25)', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Blurred preview text */}
      <div style={{ padding: '16px', userSelect: 'none' }}>
        <p style={{
          fontSize: 14, lineHeight: 1.7, color: 'var(--text)',
          fontFamily: 'monospace', filter: 'blur(5px)',
          pointerEvents: 'none', wordBreak: 'break-word',
        }}>
          {previewText}...
        </p>
      </div>

      {/* Lock overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(2px)',
      }}>
        <div style={{ textAlign: 'center', padding: '0 16px' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Premium Prompt
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            Unlock this prompt to copy &amp; use
          </p>
          <button
            onClick={handleUnlock}
            disabled={loading}
            style={{
              padding: '10px 24px',
              borderRadius: 50,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 20px rgba(255,45,120,0.4)',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Redirecting...
              </>
            ) : (
              `🔓 Unlock for ₹${price}`
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

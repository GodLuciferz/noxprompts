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
        body: JSON.stringify({ promptSlug, promptName, price, userEmail: "", userName: "" }),
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
    <div style={{
      borderRadius: 12,
      border: '1.5px solid rgba(139,47,201,0.3)',
      background: 'var(--bg)',
      padding: '24px 20px',
      textAlign: 'center',
      marginBottom: 0,
    }}>
      {/* Blurred preview */}
      <div style={{
        fontSize: 13,
        fontFamily: 'monospace',
        color: 'var(--text)',
        filter: 'blur(5px)',
        userSelect: 'none',
        pointerEvents: 'none',
        marginBottom: 20,
        lineHeight: 1.6,
      }}>
        {previewText}...
      </div>

      {/* Lock + button */}
      <div style={{ fontSize: 30, marginBottom: 8 }}>🔒</div>
      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
        Premium Prompt
      </p>
      <p style={{ margin: '0 0 18px', fontSize: 12, color: 'var(--text-muted)' }}>
        Unlock this prompt to copy & use
      </p>

      <button
        onClick={handleUnlock}
        disabled={loading}
        style={{
          display: 'inline-block',
          padding: '12px 36px',
          borderRadius: 50,
          border: 'none',
          background: 'linear-gradient(135deg,#FF2D78,#8B2FC9)',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          fontFamily: 'inherit',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          boxShadow: '0 4px 24px rgba(255,45,120,0.45)',
          letterSpacing: '0.01em',
        }}
      >
        {loading ? '⏳ Redirecting...' : `🔓 Unlock for ₹${price}`}
      </button>
    </div>
  );
}

"use client";

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

  const handleUnlock = () => {
    // Redirect to checkout page instead of directly to PayU
    window.location.href = `/checkout?slug=${promptSlug}&name=${encodeURIComponent(promptName)}&price=${price}`;
  };

  return (
    <div style={{
      borderRadius: 12,
      border: '1.5px solid rgba(139,47,201,0.3)',
      background: 'var(--bg)',
      padding: '24px 20px',
      textAlign: 'center',
    }}>
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

      <div style={{ fontSize: 30, marginBottom: 8 }}>🔒</div>
      <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
        Premium Prompt
      </p>
      <p style={{ margin: '0 0 18px', fontSize: 12, color: 'var(--text-muted)' }}>
        Unlock this prompt to copy & use
      </p>

      <button
        onClick={handleUnlock}
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
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(255,45,120,0.45)',
        }}
      >
        🔓 Unlock for ₹{price}
      </button>
    </div>
  );
}

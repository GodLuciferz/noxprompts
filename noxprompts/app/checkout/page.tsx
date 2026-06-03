// app/checkout/page.tsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const slug = params.get("slug") || "";
  const name = params.get("name") || "Premium Prompt";
  const price = params.get("price") || "9";

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptSlug: slug,
          promptName: name,
          price: parseFloat(price),
          userEmail: "",
          userName: "",
        }),
      });

      const data = await res.json();
      const { payuUrl, params: payuParams } = data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payuUrl;
      form.style.display = "none";

      Object.entries(payuParams).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "20px",
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1.5px solid var(--border)",
        borderRadius: 24,
        padding: "36px 32px",
        maxWidth: 420,
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔓</div>
          <h1 style={{
            fontFamily: "Unbounded, sans-serif",
            fontSize: 20,
            fontWeight: 900,
            color: "var(--text)",
            margin: "0 0 8px",
          }}>
            Unlock Prompt
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
            Get instant access to this premium AI prompt
          </p>
        </div>

        {/* Prompt name */}
        <div style={{
          background: "rgba(139,47,201,0.08)",
          border: "1.5px solid rgba(139,47,201,0.2)",
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 20,
        }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Prompt
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>
            {decodeURIComponent(name)}
          </p>
        </div>

        {/* Order summary */}
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Order Summary
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Prompt unlock</span>
            <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>₹{price}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Platform fee</span>
            <span style={{ fontSize: 14, color: "#00C851", fontWeight: 600 }}>FREE</span>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg,#FF2D78,#8B2FC9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ₹{price}
            </span>
          </div>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 50,
            border: "none",
            background: loading ? "#aaa" : "linear-gradient(135deg,#FF2D78,#8B2FC9)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            fontFamily: "inherit",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 24px rgba(255,45,120,0.4)",
            marginBottom: 12,
          }}
        >
          {loading ? "⏳ Redirecting to PayU..." : `💳 Pay ₹${price} Securely`}
        </button>

        <button
          onClick={() => router.back()}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 50,
            border: "1px solid var(--border)",
            background: "none",
            color: "var(--text-muted)",
            fontWeight: 600,
            fontSize: 14,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          ← Go Back
        </button>

        {/* Trust badges */}
        <div style={{ textAlign: "center", marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>🔒 Secure Payment</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>✅ Powered by PayU</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>⚡ Instant Access</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

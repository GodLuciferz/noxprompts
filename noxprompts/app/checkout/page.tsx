"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slug = params.get("slug") || "";
  const name = params.get("name") || "Premium Prompt";
  const price = params.get("price") || "9";

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cashfree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptSlug: slug,
          promptName: decodeURIComponent(name),
          price: parseFloat(price),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // Load Cashfree SDK and open payment
      const cashfreeScript = document.createElement("script");
      cashfreeScript.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      cashfreeScript.onload = () => {
        // @ts-ignore
        const cashfree = window.Cashfree({ mode: "production" });
        cashfree.checkout({
          paymentSessionId: data.sessionId,
          redirectTarget: "_self",
        });
      };
      document.head.appendChild(cashfreeScript);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔓</div>
          <h1 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 20, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
            Unlock Prompt
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
            Get instant access to this premium AI prompt
          </p>
        </div>

        <div style={{ background: "rgba(139,47,201,0.08)", border: "1.5px solid rgba(139,47,201,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Prompt</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", margin: 0 }}>{decodeURIComponent(name)}</p>
        </div>

        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Order Summary</p>
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
            <span style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg,#FF2D78,#8B2FC9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>₹{price}</span>
          </div>
        </div>

        {error && (
          <p style={{ color: "#FF2D78", fontSize: 13, textAlign: "center", marginBottom: 12 }}>⚠️ {error}</p>
        )}

        <button onClick={handlePay} disabled={loading} style={{
          width: "100%", padding: "14px", borderRadius: 50, border: "none",
          background: loading ? "#aaa" : "linear-gradient(135deg,#FF2D78,#8B2FC9)",
          color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "inherit",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 24px rgba(255,45,120,0.4)", marginBottom: 12,
        }}>
          {loading ? "⏳ Processing..." : `💳 Pay ₹${price} Securely`}
        </button>

        <button onClick={() => router.back()} style={{
          width: "100%", padding: "12px", borderRadius: 50,
          border: "1px solid var(--border)", background: "none",
          color: "var(--text-muted)", fontWeight: 600, fontSize: 14,
          fontFamily: "inherit", cursor: "pointer",
        }}>
          ← Go Back
        </button>

        <div style={{ textAlign: "center", marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>🔒 Secure Payment</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>✅ Powered by Cashfree</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⚡ Instant Access</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-client";
import Link from "next/link";

function SMMSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [smmOrderId, setSmmOrderId] = useState("");

  useEffect(() => {
    const cashfreeOrderId = params.get("order_id");
    const serviceId = params.get("service");
    const serviceName = params.get("service_name") || `Service #${serviceId}`;
    const link = params.get("link");
    const quantity = params.get("quantity");
    const amount = params.get("amount") || "0";
    const userId = params.get("user_id");
    const userEmail = params.get("user_email");

    if (!cashfreeOrderId || !serviceId || !link || !quantity) {
      setStatus("error");
      setMessage("Missing order details.");
      return;
    }

    processOrder({ cashfreeOrderId, serviceId, serviceName, link, quantity, amount, userId, userEmail });
  }, []);

  const processOrder = async ({ cashfreeOrderId, serviceId, serviceName, link, quantity, amount, userId, userEmail }: any) => {
    try {
      // Get user from session if not in URL
      let finalUserId = userId;
      let finalUserEmail = userEmail;
      if (!finalUserId) {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        finalUserId = user?.id;
        finalUserEmail = user?.email;
      }

      // Place SMM order
      const smmRes = await fetch("/api/smm/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: parseInt(serviceId),
          link: decodeURIComponent(link),
          quantity: parseInt(quantity),
        }),
      });
      const smmData = await smmRes.json();

      if (!smmData.order) {
        setStatus("error");
        setMessage(smmData.error || "SMM order placement failed. Please contact support.");
        return;
      }

      setSmmOrderId(String(smmData.order));

      // Save to Supabase
      await fetch("/api/smm/save-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: finalUserId || "",
          user_email: finalUserEmail ? decodeURIComponent(finalUserEmail) : "",
          cashfree_order_id: cashfreeOrderId,
          easysmm_order_id: String(smmData.order),
          service_id: serviceId,
          service_name: decodeURIComponent(serviceName),
          link: decodeURIComponent(link),
          quantity: parseInt(quantity),
          amount: parseFloat(amount),
          status: "pending",
          refill_eligible: false,
        }),
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Something went wrong. Please contact support with your payment ID.");
    }
  };

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ fontFamily: "Unbounded,sans-serif", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
          Processing your order...
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
          Please wait, do not close this page
        </p>
      </div>
    </div>
  );

  if (status === "error") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
      <div style={{
        background: "var(--bg-card)", border: "1.5px solid var(--border)",
        borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
        <h1 style={{ fontFamily: "Unbounded,sans-serif", fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>Order Failed</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px" }}>{message}</p>
        <Link href="/services" style={{
          display: "inline-block", padding: "12px 28px", borderRadius: 50,
          background: "linear-gradient(135deg,#FF2D78,#8B2FC9)",
          color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
        }}>Try Again</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
      <div style={{
        background: "var(--bg-card)", border: "1.5px solid var(--border)",
        borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontFamily: "Unbounded,sans-serif", fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>
          Order Placed!
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 20px" }}>
          Your Instagram order is being processed. Delivery starts shortly!
        </p>
        <div style={{
          background: "rgba(0,200,100,0.08)", border: "1px solid rgba(0,200,100,0.25)",
          borderRadius: 12, padding: "14px 20px", marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 4px" }}>EasySMM Order ID</p>
          <p style={{ fontSize: 22, fontWeight: 900, color: "#00C864", margin: 0, fontFamily: "monospace" }}>
            #{smmOrderId}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
          <Link href="/orders" style={{
            display: "block", padding: "13px 28px", borderRadius: 50,
            background: "linear-gradient(135deg,#FF2D78,#8B2FC9)",
            color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}>📦 View My Orders</Link>
          <Link href="/services" style={{
            display: "block", padding: "11px 28px", borderRadius: 50,
            border: "1px solid var(--border)", background: "none",
            color: "var(--text-muted)", fontWeight: 600, fontSize: 13, textDecoration: "none",
          }}>Place Another Order</Link>
        </div>
      </div>
    </div>
  );
}

export default function SMMSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    }>
      <SMMSuccessContent />
    </Suspense>
  );
}

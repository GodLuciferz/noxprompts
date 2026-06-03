// components/LockedPrompt.tsx
"use client";
import { useState } from "react";

interface LockedPromptProps {
  promptSlug: string;
  promptName: string;
  price: number;
  previewText: string; // First ~30 chars of prompt shown blurred
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
          userEmail: "",  // Optionally collect email before payment
          userName: "",
        }),
      });

      const data = await res.json();
      const { payuUrl, params } = data;

      // Create a hidden form and submit to PayU
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
    <div className="relative rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden bg-white dark:bg-gray-900">
      {/* Blurred preview */}
      <div className="p-4 select-none">
        <p
          className="text-sm text-gray-700 dark:text-gray-300 blur-sm pointer-events-none"
          aria-hidden="true"
        >
          {previewText}...
        </p>
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/80 backdrop-blur-[2px]">
        <div className="text-center px-4">
          {/* Lock icon */}
          <div className="text-4xl mb-2">🔒</div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
            Premium Prompt
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Unlock this prompt to copy &amp; use
          </p>

          <button
            onClick={handleUnlock}
            disabled={loading}
            className="px-6 py-2 rounded-full text-white font-bold text-sm
              bg-gradient-to-r from-pink-500 to-purple-600
              hover:from-pink-600 hover:to-purple-700
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200 shadow-lg hover:shadow-pink-300/40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Redirecting...
              </span>
            ) : (
              `🔓 Unlock for ₹${price}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

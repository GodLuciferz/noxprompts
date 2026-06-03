// app/checkout/success/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const slug = params.get("slug");
  const txnid = params.get("txnid");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          Transaction ID: <span className="font-mono text-xs">{txnid}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-4 mb-6">
          Your prompt has been unlocked. You can now copy and use it.
        </p>
        {slug && (
          <Link
            href={`/trends/${slug}?unlocked=true`}
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition"
          >
            View Prompt →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

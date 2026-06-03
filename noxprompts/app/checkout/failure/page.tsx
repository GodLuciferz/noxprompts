// app/checkout/failure/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function FailureContent() {
  const params = useSearchParams();
  const slug = params.get("slug");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4 mb-6">
          Something went wrong with your payment. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          {slug && (
            <Link
              href={`/trends/${slug}`}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition"
            >
              Try Again
            </Link>
          )}
          <Link
            href="/"
            className="px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense>
      <FailureContent />
    </Suspense>
  );
}

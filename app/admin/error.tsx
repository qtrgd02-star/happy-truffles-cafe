"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-vanilla/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="font-playfair text-2xl font-bold text-chocolate mb-4">Admin Panel Error</h1>
        <p className="text-chocolate/60 mb-6">
          {error.message || "Something went wrong in the admin panel."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 border border-chocolate/20 text-chocolate px-6 py-3 rounded-full font-semibold hover:bg-chocolate/5 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-vanilla/30 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="font-playfair text-2xl font-bold text-chocolate mb-4">Something went wrong</h1>
        <p className="text-chocolate/60 mb-6">
          {error.message || "An unexpected error occurred. Please try again later."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

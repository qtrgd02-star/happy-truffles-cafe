"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vanilla/30 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-truffle/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📡</span>
        </div>
        <h1 className="font-playfair text-3xl font-bold text-chocolate mb-4">You&apos;re Offline</h1>
        <p className="text-chocolate/60 mb-6">
          It looks like you&apos;ve lost your internet connection. Some features may be limited until you reconnect.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "happy-truffles-cookie-consent";

type ConsentStatus = "accepted" | "declined" | null;

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus;
    if (stored === "accepted" || stored === "declined") {
      setStatus(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setStatus("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setStatus("declined");
    setVisible(false);
  };

  if (!visible || status) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-chocolate/10 shadow-[0_-4px_20px_rgba(62,39,35,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-chocolate/80 text-sm text-center sm:text-left">
            We use cookies to enhance your browsing experience and analyze site traffic.
            By continuing, you agree to our use of cookies.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDecline}
              className="px-5 py-2 rounded-full text-sm font-medium text-chocolate border border-chocolate/20 hover:bg-chocolate/5 transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="px-5 py-2 rounded-full text-sm font-medium text-white bg-truffle hover:bg-chocolate transition-colors shadow-md shadow-truffle/20"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", registration.scope);

        const updateExists = () => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        };

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", updateExists);
          }
        });

        window.addEventListener("online", () => {
          window.location.reload();
        });
      } catch (err) {
        console.error("Service Worker registration failed:", err);
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}

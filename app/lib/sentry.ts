export function initSentry() {
  if (typeof window === "undefined") return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  const script = document.createElement("script");
  script.src = "https://js.sentry-cdn.com/7.64.0/bundle.tracing.min.js";
  script.crossOrigin = "anonymous";
  script.onload = () => {
    try {
      const Sentry = (window as any).Sentry;
      if (Sentry) {
        Sentry.init({ dsn, tracesSampleRate: 0.1, replaysSessionSampleRate: 0.1, replaysOnErrorSampleRate: 1.0 });
      }
    } catch (e) { console.error("Sentry init failed", e); }
  };
  document.head.appendChild(script);
}

export function logError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error, context);
  fetch("/api/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: error.message, stack: error.stack, context }),
  }).catch(() => {});
}

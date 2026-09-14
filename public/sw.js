const CACHE_NAME = "happy-truffles-v1";
const urlsToCache = [
  "/",
  "/offline.html"
];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event: any) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((response) => response || caches.match("/offline.html")))
  );
});

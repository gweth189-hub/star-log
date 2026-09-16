const CACHE_NAME = "star-log-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html"
];

// Install the service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activate the service worker
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Serve cached files when offline
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      }).catch(() => {
        return caches.match("./index.html");
      });
    })
  );
});

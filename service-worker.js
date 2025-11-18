const CACHE_NAME = 'tareascheck-cache-v1';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if (cached) return cached;
      return fetch(evt.request).then(res => {
        try {
          const url = new URL(evt.request.url);
          if (url.origin === location.origin) {
            caches.open(CACHE_NAME).then(cache => cache.put(evt.request, res.clone()));
          }
        } catch(e){}
        return res;
      }).catch(() => cached);
    })
  );
});
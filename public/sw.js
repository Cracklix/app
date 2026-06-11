/**
 * @fileOverview Production Service Worker for Cracklix PWA.
 * Browsers require a functional fetch listener to enable "Install App" features.
 */

const CACHE_NAME = 'cracklix-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 1. Install Event - Cache initial assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event - Network-First strategy to prevent stale CBT chunks
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If it's a valid response, maybe cache it (optional)
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline support)
        return caches.match(event.request);
      })
  );
});

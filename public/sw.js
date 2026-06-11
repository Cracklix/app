
/**
 * @fileOverview Institutional Service Worker v5.0.
 * HARDENED: This file is mandatory for PWA "Install App" triggers.
 * It provides the required fetch listener and network-first strategy.
 */

const CACHE_NAME = 'cracklix-cache-v1';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// MANDATORY: Fetch listener triggers the "Install" prompt in browsers
self.addEventListener('fetch', (event) => {
  // Network-first strategy for Next.js chunks to prevent ChunkLoadError
  if (event.request.url.includes('/_next/static/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Standard cache-fallback for other assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

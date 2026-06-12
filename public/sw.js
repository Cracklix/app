
/**
 * @fileOverview Official Service Worker for PWA Installation.
 * Provides basic caching and satisfies installability requirements.
 */

const CACHE_NAME = 'cracklix-v1';
const ASSETS = [
  '/',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

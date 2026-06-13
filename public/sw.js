/**
 * @fileOverview Production Service Worker for PWA Offline Node.
 */
const CACHE_NAME = 'cracklix-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through handler required for Chrome installability criteria
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

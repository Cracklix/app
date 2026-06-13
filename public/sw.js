/**
 * @fileOverview Minimalist Service Worker for PWA Compliance.
 * Mandatory for browser-level "Install App" prompt activation.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Standard pass-through fetch handler to satisfy Chrome installability criteria
  event.respondWith(fetch(event.request));
});


/**
 * @fileOverview Core PWA Service Worker for Cracklix.
 * Required for browser "Install" prompt visibility.
 */

const CACHE_NAME = 'cracklix-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Mandatory fetch handler for PWA installability
self.addEventListener('fetch', (event) => {
  // We can implement offline caching here later if needed
  return;
});

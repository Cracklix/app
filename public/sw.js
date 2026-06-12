
/**
 * @fileOverview Cracklix PWA Service Worker.
 * This is mandatory for the "Install App" button to appear on mobile devices.
 */

const CACHE_NAME = 'cracklix-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Mandatory fetch listener for PWA installability
self.addEventListener('fetch', (event) => {
  // Pass-through for now to ensure online-first behavior while satisfying PWA requirements
  return;
});

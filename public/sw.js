/**
 * @fileOverview Official Cracklix PWA Service Worker.
 * Required for "Install App" prompt to appear on Android and iOS.
 */

const CACHE_NAME = 'cracklix-v1';
const ASSETS = [
  '/',
  '/manifest.webmanifest',
  'https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Simple network-first strategy for dynamic exam content
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

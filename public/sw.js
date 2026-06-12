/**
 * @fileOverview Institutional PWA Service Worker.
 * Enables offline capability and native install prompts for Android/iOS.
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
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

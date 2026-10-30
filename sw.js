'use strict';
// Cache only this app's static shell. Never intercept or cache API requests.
const CACHE = 'nexus-shell-v1';
const FILES = ['./', './index.html', './styles.css', './app.js', './assets/engine-core.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('nexus-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin) return;
  if (event.request.mode === 'navigate' && (url.pathname === scope.pathname || url.pathname === new URL('index.html', scope).pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(new URL('index.html', scope).href)));
    return;
  }
  const allowed = FILES.slice(1).map(file => new URL(file, scope).href);
  if (!allowed.includes(url.href)) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});

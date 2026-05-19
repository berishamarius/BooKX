/* sw.js — DIE HEILIGE BIBEL offline Service Worker
 * Strategy: Cache-First for same-origin GET requests.
 * Pages are cached as visited → full offline reading after first load.
 */
'use strict';

const CACHE = 'diebibel-v2';

const SHELL = [
  '/',
  '/index.html',
  '/cover.html',
  '/back-cover.html',
  '/manifest.json',
];

/* ── Install: pre-cache the shell ────────────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: remove old caches ─────────────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first for same-origin GET ───────────────────── */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Skip cross-origin requests (Google Fonts etc.) — let browser handle them
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(() => {
        // Offline fallback: navigation → cover page, else empty 503
        if (req.mode === 'navigate') {
          return caches.match('/cover.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

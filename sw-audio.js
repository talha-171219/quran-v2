const CACHE_NAME = 'quran-audio-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './audio.html',
  // All 114 audio files (relative paths)
  ...Array.from({ length: 114 }, (_, i) => `./audio/${String(i + 1).padStart(3, '0')}.mp3`)
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(FILES_TO_CACHE).catch(err => {
        console.warn('Some files failed to cache:', err);
        return Promise.resolve();
      })
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== location.origin) return;

  // Cache-first for audio files (match .mp3 suffix)
  if (url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(req) || await cache.match(req.url);
        if (cached) return cached;
        try {
          const resp = await fetch(req);
          if (resp && resp.ok) cache.put(req, resp.clone());
          return resp;
        } catch {
          return new Response('Offline', { status: 503 });
        }
      })
    );
    return;
  }

  // Network-first for HTML
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req).then(resp => {
        caches.open(CACHE_NAME).then(c => c.put(req, resp.clone()));
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Stale-while-revalidate for others
  event.respondWith(
    caches.match(req).then(match => {
      const fetchPromise = fetch(req).then(resp => {
        if (resp && resp.ok) caches.open(CACHE_NAME).then(c => c.put(req, resp.clone()));
        return resp;
      });
      return match || fetchPromise;
    })
  );
});

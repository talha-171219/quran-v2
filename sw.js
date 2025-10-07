const VERSION = 'v4';
const CACHE_PREFIX = 'quran-app-';
const RUNTIME = `${CACHE_PREFIX}runtime-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './audio.html',
  './style.css',
  './script.js',
  './dua.js',
  './pwa.js',
  './manifest.json'
];

// simple utility to safe-put into cache
async function safeCachePut(cacheName, req, res){
  try{
    if(!res || !res.ok) return;
    if(res.status === 206) return; // skip partial
    const c = await caches.open(cacheName);
    await c.put(req, res.clone());
  }catch(e){ /* swallow */ }
}

self.addEventListener('install', event=>{
  self.skipWaiting();
  event.waitUntil((async ()=>{
    const c = await caches.open(RUNTIME);
    await c.addAll(ASSETS).catch(()=>{});
    // NOTE: don't prefetch all audio on install (would trigger 100+ parallel requests).
    // Audio files are cached on-demand when the user requests them or by using the
    // 'PRECACHE_AUDIO' message which runs in a controlled loop. This keeps install
    // fast and avoids network congestion on slow hosts.
  })());
});

self.addEventListener('activate', event=>{
  event.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>!k.startsWith(CACHE_PREFIX) || k===RUNTIME && k.includes('v')).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event=>{
  const req = event.request;
  const url = new URL(req.url);

  // 1) audio files: CacheFirst strategy but DO NOT serve or cache partial (206) responses.
  // For Range requests, pass through to network to let the browser handle streaming.
  if(url.pathname.endsWith('.mp3')){
    event.respondWith((async ()=>{
      const audioCache = await caches.open(`${CACHE_PREFIX}audio-${VERSION}`);
      const rangeHeader = req.headers.get('range');

      // If client asked for a byte range, don't try to satisfy it from cache here —
      // just forward the request to network so the server can handle ranges properly.
      if(rangeHeader){
        try{
          const netResp = await fetch(req);
          // if we got a full response (rare for range requests), cache it as full (only 200)
          if(netResp && netResp.ok && netResp.status === 200){
            try{ await audioCache.put(req.url, netResp.clone()); }catch(e){}
          }
          return netResp;
        }catch(e){
          // fallback to cached full file (if present)
          const cachedFull = await audioCache.match(req.url);
          if(cachedFull) return cachedFull;
          return new Response('Audio unavailable', { status: 503 });
        }
      }

      // Non-range requests: prefer cache, but only return cached entries that are full (200).
      const cached = await audioCache.match(req.url);
      if(cached) return cached;

      try{
        const net = await fetch(req);
        // Only cache full 200 responses; skip partials (206)
        if(net && net.ok && net.status === 200){
          try{ await audioCache.put(req.url, net.clone()); }catch(e){}
          return net;
        }
        // If server returned 206 (partial), try to fetch full resource without Range
        if(net && net.status === 206){
          try{
            const fullResp = await fetch(req.url);
            if(fullResp && fullResp.ok && fullResp.status === 200){
              try{ await audioCache.put(req.url, fullResp.clone()); }catch(e){}
              return fullResp;
            }
          }catch(e){}
        }
        return net;
      }catch(e){
        return cached || new Response('Audio unavailable', { status: 503 });
      }
    })());
    return;
  }

  // 2) API/JSON: Network-first
  if(url.pathname.endsWith('quran.json') || url.pathname.endsWith('dua.json')){
    event.respondWith((async ()=>{
      try{
        const net = await fetch(req);
        await safeCachePut(RUNTIME, req, net);
        return net;
      }catch(e){
        return caches.match(req);
      }
    })());
    return;
  }

  // 3) Stale-While-Revalidate for other assets (CSS/JS/HTML)
  event.respondWith((async ()=>{
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(req);
    const networkFetch = fetch(req).then(async res=>{ await safeCachePut(RUNTIME, req, res); return res; }).catch(()=>null);
    return cached || (await networkFetch) || caches.match('/index.html');
  })());
});

// allow runtime message to pre-cache all audio on demand from the page
self.addEventListener('message', (event)=>{
  if(!event.data) return;
  if(event.data.type === 'PRECACHE_AUDIO'){
    (async ()=>{
      try{
        const clientsList = await self.clients.matchAll({ includeUncontrolled: true });
        const audioCache = await caches.open(`${CACHE_PREFIX}audio-${VERSION}`);
        const total = 114; let done = 0;
        for(let i=1;i<=total;i++){
          const u = `./audio/${String(i).padStart(3,'0')}.mp3`;
          try{
            const r = await fetch(u);
            if(r && r.ok && r.status!==206){ await audioCache.put(u, r.clone()); }
          }catch(e){ /* ignore */ }
          done++;
          // broadcast progress
          for(const c of clientsList){ c.postMessage({ type:'PRECACHE_PROGRESS', done, total, url: u }); }
        }
        for(const c of clientsList){ c.postMessage({ type:'PRECACHE_DONE', total }); }
      }catch(e){
        // notify failure
        const clientsList = await self.clients.matchAll({ includeUncontrolled: true });
        for(const c of clientsList){ c.postMessage({ type:'PRECACHE_ERROR' }); }
      }
    })();
  }
});

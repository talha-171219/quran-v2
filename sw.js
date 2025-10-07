const VERSION = 'v3';
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
    // attempt to pre-cache audio files (001-114). failures are ignored.
    try{
      const audioCache = await caches.open(`${CACHE_PREFIX}audio-${VERSION}`);
      const audioUrls = Array.from({length:114}, (_,i)=>`./audio/${String(i+1).padStart(3,'0')}.mp3`);
      const results = await Promise.allSettled(audioUrls.map(u=>fetch(u).then(r=>{ if(r && r.ok && r.status!==206){ audioCache.put(u, r.clone()).catch(()=>{}); } } ).catch(()=>{})));
      // ignore results
    }catch(e){ /* ignore audio pre-cache errors */ }
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

  // 1) audio files: CacheFirst strategy
  if(url.pathname.endsWith('.mp3')){
    event.respondWith((async ()=>{
      const cache = await caches.open(`${CACHE_PREFIX}audio-${VERSION}`);
      // If this is a range request, attempt to serve a byte-range from cached full file
      const rangeHeader = req.headers.get('range');
      if(rangeHeader){
        // try to find a cached full response (without range)
        const fullKey = req.url; // use same URL for full file caching
        const cachedFull = await cache.match(fullKey);
        if(cachedFull){
          try{
            const buf = await cachedFull.arrayBuffer();
            const size = buf.byteLength;
            const m = /bytes=(\d+)-(\d+)?/.exec(rangeHeader);
            let start = 0, end = size - 1;
            if(m){ start = Number(m[1]); if(m[2]) end = Number(m[2]); }
            if(start < 0) start = 0; if(end >= size) end = size - 1;
            const chunk = buf.slice(start, end + 1);
            const headers = new Headers();
            headers.set('Content-Type', cachedFull.headers.get('Content-Type') || 'audio/mpeg');
            headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
            headers.set('Accept-Ranges', 'bytes');
            headers.set('Content-Length', String(chunk.byteLength));
            return new Response(chunk, { status: 206, statusText: 'Partial Content', headers });
          }catch(e){ /* fallthrough to fetch */ }
        }
      }

      // Non-range or no cached full. Try cache first.
      const cached = await cache.match(req);
      if(cached) return cached;
      try{
        const net = await fetch(req);
        // if server returned partial (206) we attempt to fetch full by removing range
        if(net && net.ok && net.status !== 206){ await cache.put(req, net.clone()); return net; }
        // if net is 206, try to fetch full resource
        if(net && net.status === 206){
          try{
            const fullResp = await fetch(req.url); // request without Range
            if(fullResp && fullResp.ok){ await cache.put(req.url, fullResp.clone()); return fullResp; }
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

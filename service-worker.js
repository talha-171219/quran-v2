const CACHE_NAME = 'quran-app-cache-v1';
const CORE_ASSETS = [
  './', './index.html', './quran.html', './audio.html', './dua.html', './tafsir.html',
  './style.css', './script.js', './pwa.js', './tafsir.js', './manifest.json'
];

// Precache core + attempt to cache PDFs under /static/pdfs/
self.addEventListener('install', (e)=>{
  self.skipWaiting();
  e.waitUntil((async ()=>{
    const c = await caches.open(CACHE_NAME);
    await c.addAll(CORE_ASSETS).catch(()=>{});
    // try to cache up to 10 PDF files if present
    for(let i=1;i<=10;i++){
      const url = `/static/pdfs/tafsir_volume_${i}.pdf`;
      try{ const r = await fetch(url); if(r && r.ok) await c.put(url, r.clone()); }catch(e){}
    }
  })());
});

self.addEventListener('activate', (e)=>{
  e.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  const url = new URL(req.url);

  // Serve PDFs from cache-first
  if(url.pathname.startsWith('/static/pdfs/') || url.pathname.endsWith('.pdf')){
    e.respondWith((async ()=>{
      const c = await caches.open(CACHE_NAME);
      const cached = await c.match(req);
      if(cached) return cached;
      try{ const net = await fetch(req); if(net && net.ok) { c.put(req, net.clone()); return net; } }catch(e){}
      return new Response('PDF unavailable', { status: 503 });
    })());
    return;
  }

  // other assets: stale-while-revalidate
  e.respondWith((async ()=>{
    const c = await caches.open(CACHE_NAME);
    const cached = await c.match(req);
    const net = fetch(req).then(async r=>{ if(r && r.ok) await c.put(req, r.clone()); return r; }).catch(()=>null);
    return cached || (await net) || new Response('Offline', { status: 503 });
  })());
});

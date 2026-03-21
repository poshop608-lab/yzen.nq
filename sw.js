const CACHE='yzennq-v1';
const ASSETS=['/'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  // Network first — always get fresh data, fall back to cache
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).catch(()=>caches.match('/'))
    );
    return;
  }
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request))
  );
});

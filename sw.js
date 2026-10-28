/* Fatumah's Closet — service worker
   Network-first for the page (so she always gets your newest letter),
   cache-first for art and fonts (so it works on a bad connection). */
const CACHE='fatumahs-closet-v4';
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./favicon.svg',
  './icon-192.png','./icon-512.png','./icon-192-maskable.png','./icon-512-maskable.png',
  './apple-touch-icon.png','./favicon-32.png','./favicon-16.png','./og-image.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      /* addAll fails the whole install if one file is missing, so add one by one */
      .then(c=>Promise.all(ASSETS.map(url=>c.add(url).catch(()=>null))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);

  /* the page itself: always try the network first */
  if(req.mode==='navigate'){
    e.respondWith(
      fetch(req)
        .then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return res})
        .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))
    );
    return;
  }

  /* never cache the backend */
  if(url.hostname.endsWith('supabase.co'))return;

  const cacheable=url.origin===self.location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(!cacheable)return;

  e.respondWith(
    caches.match(req).then(cached=>{
      if(cached)return cached;
      return fetch(req).then(res=>{
        if(res.ok){
          const copy=res.clone();
          caches.open(CACHE).then(c=>c.put(req,copy));
        }
        return res;
      });
    })
  );
});

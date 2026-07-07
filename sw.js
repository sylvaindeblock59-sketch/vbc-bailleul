// VBC Bailleul — Service Worker v3.0
// Network-First : toujours la dernière version du HTML
const CACHE = 'vbc-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;

  const isHTML = e.request.mode === 'navigate'
    || e.request.url.endsWith('.html')
    || e.request.url.endsWith('/');

  if (isHTML) {
    // NETWORK-FIRST : toujours chercher la version fraîche
    e.respondWith(
      fetch(e.request, { cache: 'no-store' })
        .then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match(e.request))
    );
  } else {
    // CACHE-FIRST pour les assets statiques
    e.respondWith(
      caches.match(e.request).then(cached => cached ||
        fetch(e.request).then(r => {
          caches.open(CACHE).then(c => c.put(e.request, r.clone()));
          return r;
        })
      )
    );
  }
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

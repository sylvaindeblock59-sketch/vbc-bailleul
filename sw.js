// VBC Bailleul — Service Worker v2.0
// Stratégie : Network-First pour le HTML (toujours la dernière version)
//             Cache-First pour les assets statiques (icônes, manifest)
// Auto-update : détecte les nouvelles versions et les active sans action de l'utilisateur

const CACHE_VERSION = 'vbc-v2-' + Date.now(); // change à chaque déploiement si le SW lui-même change
const STATIC_CACHE = 'vbc-static-v2';
const STATIC_ASSETS = [
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installation : mise en cache des assets statiques.
// On N'appelle PLUS skipWaiting() ici automatiquement : on attend le feu vert
// de la page (message SKIP_WAITING) pour ne pas couper une session en cours
// au mauvais moment. La page envoie ce message dès qu'elle détecte une MAJ.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

// Réception du message envoyé par la page pour activer la nouvelle version
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activation : nettoyer tous les anciens caches + prendre le contrôle immédiat
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch : stratégie différenciée
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('youtube.com')) return;
  if (event.request.url.includes('supabase.co')) return; // jamais cacher les appels API

  const url = new URL(event.request.url);
  const isHTML = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  if (isHTML) {
    // NETWORK-FIRST pour le HTML : toujours essayer le réseau d'abord
    // pour avoir la dernière version. Cache uniquement comme secours hors-ligne.
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // CACHE-FIRST pour le reste (icônes, manifest) : rapide, change rarement
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }
});

// Notifications push (pour de futurs rappels de séance)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'VBC Bailleul';
  const options = {
    body: data.body || 'Rappel : séance du jour !',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    tag: 'vbc-seance',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data.url || './');
    })
  );
});

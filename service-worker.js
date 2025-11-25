// It's recommended to update the cache name when you update the app.
const CACHE = 'agroenglish-pro-v19';

const PRECACHE = [
  '/',
  '/index.html',
  '/main.js',
  '/src/styles/styles.css',
  '/src/components/Header.js',
  '/src/pages/Home.js',
  '/src/pages/Level.js',
  '/src/pages/Settings.js',
  '/src/pages/Offline.js',
  '/src/pages/TextPage.js',
  '/src/components/PhraseCard.js',
  '/src/components/VoiceSelector.js',
  '/src/pages/Glossary.js',
  '/src/components/GlossaryCard.js',
  '/src/data/vocabularyData.js',
  '/public/manifest.json',
  '/src/data/texts/A1/basic.json',
  '/src/data/texts/A2/basic.json',
  '/src/data/texts/B1/basic.json',
  '/src/data/texts/B2/basic.json',
  '/src/data/texts/C1/basic.json',
  '/src/data/texts/C2/basic.json',
  '/src/data/texts/A1/a1_blocks.json',
  '/src/data/texts/A2/a2_blocks.json',
  '/src/data/texts/B1/b1_blocks.json',
  '/src/data/texts/B2/b2_blocks.json',
  '/src/data/texts/C1/c1_blocks.json',
  '/src/data/texts/C2/c2_blocks.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('/index.html').then((r) => r || fetch(req)));
    return;
  }
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin)
    return;
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          const isCacheable = res && res.status === 200 && res.type === 'basic' && !req.headers.get('range');
          if (isCacheable) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_FILES') {
    const { files } = event.data;
    if (files && files.length > 0) {
      caches.open(CACHE).then((cache) => {
        cache.addAll(files).then(() => {
          console.log('Files cached successfully');
        });
      });
    }
  }
});

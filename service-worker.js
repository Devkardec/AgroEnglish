// It's recommended to update the cache name when you update the app.
const CACHE = 'agroenglish-pro-v20';

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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Navegação: tenta index.html do cache ou rede, e se tudo falhar, mostra fallback mínimo.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        if (cached) return cached;
        return fetch(request).catch(() => {
          const offlineHtml = `
            <!doctype html>
            <html lang=\"pt-BR\">
              <head>
                <meta charset=\"utf-8\">
                <title>Offline - AgroEnglish Pro</title>
                <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">
                <meta name=\"theme-color\" content=\"#0b3a1e\">
              </head>
              <body style=\"font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 16px; background:#f5f5f5;\">
                <h1 style=\"font-size: 1.5rem; margin-bottom: 0.5rem;\">Você está offline</h1>
                <p style=\"margin-bottom: 1rem;\">Sem conexão e sem cache carregado ainda. Quando estiver online, abra o app para preparar o uso offline.</p>
                <p>Caso o app já esteja instalado, tente abrir novamente em alguns segundos.</p>
              </body>
            </html>
          `;
          return new Response(offlineHtml, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        });
      })
    );
    return;
  }

  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin)
    return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          const ok =
            response &&
            response.status === 200 &&
            response.type === 'basic' &&
            !request.headers.get('range');
          if (ok) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Sem network: se houver cache, devolve; senão, fallback mínimo.
          if (cached) return cached;

          const accept = request.headers.get('accept') || '';
          if (accept.includes('application/json')) {
            return new Response(JSON.stringify({ offline: true }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }

          return new Response('Offline', {
            status: 503,
            statusText: 'Offline',
          });
        });

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

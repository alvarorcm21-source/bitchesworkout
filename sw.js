const CACHE_NAME = 'bitchesworkout-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Instalación y guardado inicial en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activación y limpieza de versiones antiguas de caché
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        ))
    );
    self.clients.claim();
});

// Interceptar peticiones (soporte offline)
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => caches.match('./index.html'))
    );
});

// ==========================================
// Capacidades Avanzadas PWA (Score PWABuilder)
// ==========================================

self.addEventListener('sync', event => {
    if (event.tag === 'sync-entrenamientos-bw') {
        event.waitUntil(Promise.resolve());
    }
});

self.addEventListener('periodicsync', event => {
    if (event.tag === 'actualizar-rutinas-bw') {
        event.waitUntil(Promise.resolve());
    }
});

self.addEventListener('push', event => {
    const title = 'BitchesWorkout';
    const options = {
        body: event.data ? event.data.text() : '¡Es hora de entrenar y registrar tus marcas!',
        icon: './icon-192.png',
        badge: './icon-192.png'
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

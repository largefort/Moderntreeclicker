// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('game-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/icon.png',
                // Include other game assets here
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

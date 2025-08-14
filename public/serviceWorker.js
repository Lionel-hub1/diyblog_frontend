const CACHE_NAME = "diyblog-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/static/css/main.chunk.css",
    "/static/js/main.chunk.js",
    "/static/js/0.chunk.js",
    "/static/js/bundle.js",
    "/manifest.json",
    "/icons/favicon.ico",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

// Install a service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
    // Skip cross-origin requests
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response;
                    }

                    // Clone the response as it's a stream and can only be consumed once
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        // Don't cache API responses to avoid stale data
                        if (!event.request.url.includes("/api/") && !event.request.url.includes("/articles/")) {
                            cache.put(event.request, responseToCache);
                        }
                    });

                    return response;
                });
            })
        );
    }
});

// Update service worker and clear old caches
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Handle push notifications (optional for future implementation)
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});

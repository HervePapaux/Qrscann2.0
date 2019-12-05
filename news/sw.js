self.addEventListener('push', function (event) {
    if (event.data) {
        console.log('Push succed: ', event.data.text());
    } else {
        console.log('This push event has no data.');
    }


    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: 'favicon.ico/apple-touch-icon.png',
        badge: 'images/badge.png'
    };
    self.registration.showNotification(title, options);

});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://hervepapaux.github.io/Qrscann/news/')
    );
});
const dynamicCacheName = 'site-dynamic-v1';
// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});
// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
    );
});
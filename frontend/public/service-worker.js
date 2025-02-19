// Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        // 필요한 다른 정적 리소스들
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

// 백그라운드 위치 추적 (if needed)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'START_LOCATION_TRACKING') {
    // Background location tracking logic here
  }
});
// Service Worker - オフライン対応とキャッシング
const CACHE_NAME = 'anki-system-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

// インストール処理
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// アクティベーション処理（古いキャッシュを削除）
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ処理（キャッシュファースト戦略）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // キャッシュがあればそれを返す
      if (response) {
        return response;
      }
      
      // キャッシュがなければネットワークから取得
      return fetch(event.request).then(response => {
        // ネットワークエラーの場合はキャッシュを返す
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // 成功したレスポンスはキャッシュに追加
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // ネットワークエラーの場合
        return caches.match(event.request);
      });
    })
  );
});

// バックグラウンド同期（オフライン時の動作確認用）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // ここで同期処理を実施できる
      Promise.resolve()
    );
  }
});

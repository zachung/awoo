const cacheVersion = 'v1'
const filesToCache = [
  'favicon.ico',
  'index.html',
  'main.js',
  'service-worker.js',
  'main.css',
  'images/icon.png'
]
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install')
  // 進行檔案快取，讓離線時也能顯示頁面
  event.waitUntil(
    caches.open(cacheVersion).then(cache => {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate')
  // 刪除舊的快取
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheVersion) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})
self.addEventListener('fetch', event => {
  // console.log('[ServiceWorker] fetch', event.request)
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request))
  )
})
self.addEventListener('notificationclick', event => {
  const notification = event.notification
  const action = event.action
  notification.close()
  console.log('notificationclick action is', action)
})
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.')
  let title = 'Server Push'
  let options = {
    body: 'push TEST',
    icon: 'images/icon.png'
  }
  if (event.data) {
    options = event.data.json()
    title = options.title
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

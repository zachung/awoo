// CODELAB: Register service worker.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      // registration worked
      console.log(
        '[Service Worker] Registration succeeded. Scope is ' + reg.scope
      )
      if ('Notification' in window) {
        console.log(
          'Notification permission default status:',
          Notification.permission
        )
        Notification.requestPermission(function (status) {
          console.log('Notification permission status:', status)
          displayNotification()
        })
      }
      subscribeUser(reg)
    })
  })
}

function displayNotification () {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(reg => {
      const options = {
        icon: 'images/icon.png',
        body: '歡迎加入 Awoo 的世界'
      }
      reg.showNotification('Awoo 推播', options)
      console.log('displayNotification')
    })
  }
}

const applicationServerPublicKey = `BIgJUwf48URPko1t0mzzaB2aydbjO03vjKipOpLQy8mS-xXNt8FakaKuui-6P_m2T72fBTFsHDIw-7ebnUvBTmQ`

function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function subscribeUser (swRegistration) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(subscription => {
      console.log('User is subscribed')
      console.log(JSON.stringify(subscription))
    })
    .catch(err => {
      console.log('Failed to subscribe the user: ', err)
    })
}

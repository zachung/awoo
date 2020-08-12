const applicationServerPublicKey = `BBfICJF039kEkgVzL5zYPpR5fmm28S1VtwdEvh1Kr5aSsKZ5aEzVKVNZXVc7C-oQpe5E_F1r7CVgwsdtxvtq-_Y`

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

export const subscribeUser = (swRegistration, messenger) => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(subscription => {
      console.log('User is subscribed')
      console.log(JSON.stringify(subscription))
      messenger.subscribe(subscription)
    })
    .catch(err => {
      console.log('Failed to subscribe the user: ', err)
    })
}
export const unsubscribeUser = (swRegistration, messenger) => {
  swRegistration.pushManager
    .getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe()
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error)
    })
    .then(function () {
      messenger.subscribe(null)
      console.log('User is unsubscribed.')
    })
}

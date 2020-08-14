import { ServerPublicKey } from './Env'

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

export const subscribeUser = swRegistration => {
  const applicationServerKey = urlB64ToUint8Array(ServerPublicKey)
  return swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
}
export const unsubscribeUser = swRegistration => {
  return swRegistration.pushManager
    .getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe()
      }
    })
}

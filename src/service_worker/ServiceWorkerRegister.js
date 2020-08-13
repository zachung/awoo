import { subscribeUser, unsubscribeUser } from '../lib/Subscribe'

class ServiceWorkerRegister {
  register () {
    // CODELAB: Register service worker.
    if ('serviceWorker' in navigator) {
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
          })
        }
        reg.pushManager.getSubscription().then(subscription => {
          this.isSubscribed = !!subscription
        })
        this.reg = reg
      })
    }
  }

  subscribe (messenger) {
    return subscribeUser(this.reg, messenger)
      .then(subscription => {
        this.isSubscribed = true
        return subscription
      })
  }

  unsubscribe (messenger) {
    return unsubscribeUser(this.reg, messenger)
      .then(() => {
        this.isSubscribed = false
      })
  }
}

export default ServiceWorkerRegister

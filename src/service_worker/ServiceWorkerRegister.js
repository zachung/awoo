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
        this.reg = reg
      })
    }
  }

  subscribe (messenger) {
    subscribeUser(this.reg, messenger)
  }

  unsubscribe (messenger) {
    unsubscribeUser(this.reg, messenger)
  }
}

export default ServiceWorkerRegister

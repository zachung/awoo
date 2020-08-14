import Stage from './Stage'
import JsonChunkReader from './JsonChunkReader'
import io from 'socket.io-client'
import Messenger from './Messenger'
import Camera from './Camera'
import Controller from './Controller'
import ServiceWorkerRegister from '../service_worker/ServiceWorkerRegister'

/**
 * @property {Stage} stage
 */
class Game {
  constructor (props) {
    this.props = props
    this.isOn = false
    this.isConnected = false
    this.currentOnline = 0
    const { viewSize, cameraDelta } = this.props

    const camera = new Camera()
    camera.setDelta(cameraDelta.x, cameraDelta.y)
    this.stage = new Stage({
      viewSize,
      camera
    })
    this.controller = new Controller({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd'
    })
    const serviceWorkerRegister = new ServiceWorkerRegister()
    serviceWorkerRegister.register()
    this.serviceWorkerRegister = serviceWorkerRegister
  }

  get player () {
    return this.stage.player
  }

  start (name) {
    this.props.name = name
    if (this.starting) {
      return Promise.reject('starting')
    }
    this.starting = true
    return this.messenger
      .newPlayer(name)
      .then(({ x, y }) => {
        return this.stage.focusPlayer(x, y, name).then(player => {
          player.props.name = name
          this.controller.init(player, this.messenger)
          return player
        })
      })
      .then(player => {
        this.startRender()
        this.isOn = true
        return player
      })
      .finally(() => {
        this.starting = false
      })
  }

  connect (uri, afterConnected) {
    if (this.connecting) {
      return Promise.reject('connecting')
    }
    this.connecting = true
    const socket = io(uri)
    const messenger = new Messenger(socket, {
      game: this,
      name: this.props.name,
      stage: this.stage
    })
    this.stage.setChunkReader(new JsonChunkReader(messenger))
    this.stage.renewChunks()
    this.messenger = messenger
    this.afterConnected = afterConnected
  }

  connected () {
    this.isConnected = true
    this.connecting = false
    const name = this.props.name
    if (!name) {
      // 尚未登入
      if (this.afterConnected) {
        this.afterConnected()
      }
      return
    }
    this.stage.renewChunks()
    this.messenger.newPlayer(name).then(({ x, y }) => {
      return this.stage.focusPlayer(x, y, name).then(player => {
        this.controller.bindItem(player)
        return player
      })
    })
  }

  startRender () {
    // timer for render
    setInterval(() => {
      this.stage.cameraFollow().catch(status => {
        if (status === 404) {
          console.log('Map limited')
          return
        }
        console.log(status)
      })
    }, 16)
  }

  save (cb) {
    return this.stage.save(chunks => {
      chunks.forEach(cb)
      return chunks
    })
  }

  subscribe () {
    return this.serviceWorkerRegister
      .subscribe()
      .then(subscription => {
        console.log('User is subscribed')
        this.messenger.subscribe(subscription)
      })
  }

  unsubscribe () {
    return this.serviceWorkerRegister
      .unsubscribe()
      .then(() => {
        this.messenger.subscribe()
        console.log('User is unsubscribed.')
      })
  }
}

export default Game

import Messages from './Messages'

const listeners = {
  connect () {
    Messages.info('連線成功')
    this.options.events.newPlayer(this.options.name)
  },
  connect_error (err) {
    // polling server failed...
    Messages.error(`server 沒有回應(${err.message})`)
  },
  connect_timeout (err) {
    Messages.error(`server 連線超時(${err.message})`)
  },
  disconnect (reason) {
    Messages.error('失去連線')
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      this.socket.connect()
      return
    }
    Messages.info('正在準備重新連線')
  },
  in_game (...args) {
    return this.options.inGame(...args)
  },
  sync_blocks (data) {
    const stage = this.options.stage
    // update data
    for (const itemData of data) {
      // change itemData
      stage.replace(itemData)
    }
  },
}

class Listens {
  constructor (socket, options) {
    this.socket = socket
    this.options = options

    Object.keys(listeners).forEach(event =>
      socket.on(event, listeners[event].bind(this))
    )
  }
}

export default Listens

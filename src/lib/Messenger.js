import sync_blocks from './events/SyncBlocks'
import disconnect from './events/Disconnect'
import connect_error from './events/ConnectError'
import connect_timeout from './events/ConnectTimeout'
import connect from './events/Connect'

class Messenger {
  constructor (socket, options) {
    this.socket = socket
    this.options = options

    const events = {
      connect,
      connect_error,
      connect_timeout,
      disconnect,
      sync_blocks,
    }

    for (let eventsKey in events) {
      socket.on(eventsKey, events[eventsKey].bind(this, socket, this.options))
    }
  }

  newPlayer (name) {
    return new Promise((resolve, reject) => {
      this.socket.emit('new_player', name, (err, ...args) => {
        if (err) {
          reject(err)
          return
        }
        resolve(...args)
      })
    })
  }

  syncWorld (chunk, cb) {
    this.socket.emit('sync_world', chunk, c => {
      cb(Object.values(c)[0])
    })
  }

  move ({ name, x, y }, cb) {
    this.socket.emit('move', { name, x, y }, cb)
  }
}

export default Messenger

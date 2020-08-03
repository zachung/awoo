class Events {
  constructor (socket) {
    this.socket = socket
  }

  newPlayer (name) {
    this.socket.emit('new-player', name)
  }

  syncWorld (chunk, cb) {
    this.socket.emit('sync-world', chunk, c => {
      cb(Object.values(c)[0])
    })
  }

  move (name, x, y) {
    this.socket.emit('move', { name, x, y })
  }
}

export default Events

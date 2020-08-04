class Events {
  constructor (socket) {
    this.socket = socket
  }

  newPlayer (name) {
    this.socket.emit('new_player', name)
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

export default Events

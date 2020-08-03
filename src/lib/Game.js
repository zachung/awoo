import Stage from './Stage'
import JsonChunkReader from './JsonChunkReader'
import io from 'socket.io-client'
import Events from './Events'

/**
 * @property {Stage} stage
 */
class Game {
  constructor (props) {
    this.props = props
    this.isOn = false
  }

  start () {
    return this.connect(this.props.serverUri)
      .then(({ x, y }) => {
        const { viewSize, cameraDelta } = this.props
        this.stage = new Stage({
          viewSize,
          cameraDelta,
          chunkReader: new JsonChunkReader(this.events)
        })
        return this.stage.cameraGoTo(x, y)
          .then(() => this.stage.getChunkItem(x, y))
          .then(player => {
            player.name = this.props.name
            this.player = player
            this.startRender()
            this.isOn = true
            return player
          })
      })
  }

  connect (uri) {
    return new Promise((resolve, reject) => {
      const socket = io(uri)
      this.events = new Events(socket)
      socket.on('connect', () => {
        console.log('connected')
        this.events.newPlayer(this.props.name)
        socket.on('in-game', resolve)
        socket.on('sync-world', exports => {
          // update chunks
          for (const chunkName in exports) {
            console.log(exports[chunkName])
            this.stage.reloadChunk(chunkName, exports[chunkName])
          }
        })
      })
    })
  }

  startRender () {
    // timer for render
    setInterval(() => {
      this.stage
        .cameraGoTo(this.player.globalX, this.player.globalY)
        .catch(status => {
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
}

export default Game

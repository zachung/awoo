import Stage from './Stage'
import JsonChunkReader from './JsonChunkReader'
import io from 'socket.io-client'
import Events from './Events'
import Listens from './Listens'
import Camera from './Camera'

/**
 * @property {Stage} stage
 */
class Game {
  constructor (props) {
    this.props = props
    this.isOn = false
  }

  start (cb) {
    return this.connect(this.props.serverUri)
      .then(({ x, y }) => {
        this.camera.goto(x, y)
        return this.stage.cameraFollow()
          .then(() => this.stage.getChunkItem(x, y))
          .then(player => {
            player.name = this.props.name
            this.player = player
            this.startRender(cb)
            this.isOn = true
            return player
          })
      })
  }

  connect (uri) {
    return new Promise((resolve, reject) => {
      const socket = io(uri)
      const events = new Events(socket)
      const { viewSize, cameraDelta } = this.props
      const camera = new Camera()
      camera.setDelta(cameraDelta.x, cameraDelta.y)
      this.stage = new Stage({
        viewSize,
        camera,
        chunkReader: new JsonChunkReader(events)
      })
      this.camera = camera
      const listens = new Listens(socket, {
        inGame: resolve,
        events,
        name: this.props.name,
        stage: this.stage
      })
      this.events = events
    })
  }

  startRender (cb) {
    // timer for render
    setInterval(() => {
      this.stage
        .cameraFollow()
        .then(cb)
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

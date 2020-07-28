import { Stage, Item, Symbols } from 'awoo-core'

/**
 * @property {Stage} stage
 */
class Game {
  constructor (props) {
    const { viewSize, cameraDelta } = props
    this.stage = new Stage({
      viewSize,
      cameraDelta
    })
  }

  start () {
    const initX = 16
    const initY = 16
    return Promise.resolve()
      .then(() => {
        return this.addPlayer({ x: initX, y: initY })
      })
      .then(player => {
        this.startRender()
        return player
      })
  }

  addPlayer ({ x, y }) {
    const player = new Item(Symbols.Items[0])
    player.x = x
    player.y = y
    return this.stage.cameraGoTo(x, y)
      .then(() => {
        this.stage.chunk.addItem(player)
        this.player = player
        return player
      })
  }

  startRender () {
    // timer for render
    setInterval(() => {
      this.stage.cameraGoTo(this.player.globalX, this.player.globalY)
        .catch(status => {
          if (status === 404) {
            console.log('Map limited')
            return
          }
          console.log(status)
        })
    }, 100)
  }
}

export default Game
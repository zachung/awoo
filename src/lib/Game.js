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
    this.isOn = false
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
        this.isOn = true
        return player
      })
  }

  addPlayer ({ x, y }) {
    const player = new Item({
      symbol: Symbols.Items[0],
      x,
      y
    })
    return this.stage.cameraGoTo(x, y).then(() => {
      this.stage.chunk.addItem(player)
      this.player = player
      return player
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
}

export default Game

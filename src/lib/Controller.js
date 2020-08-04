import hotkeys from 'hotkeys-js'

/**
 * @property {Item} item
 */
class Controller {
  constructor (item, options = {}) {
    this.item = item
    this.x = item.globalX
    this.y = item.globalY
    this.init(options)
  }

  init (options) {
    const {
      up = 'up',
      down = 'down',
      right = 'right',
      left = 'left'
    } = options
    this.options = options
    hotkeys(left, () => this.left())
    hotkeys(up, () => this.up())
    hotkeys(right, () => this.right())
    hotkeys(down, () => this.down())
  }

  left () {
    this.move(-1, 0)
  }

  up () {
    this.move(0, -1)
  }

  right () {
    this.move(1, 0)
  }

  down () {
    this.move(0, 1)
  }

  move (dx, dy) {
    const item = this.item
    this.options.events.move({
      name: item.name,
      x: this.x + dx,
      y: this.y + dy
    }, err => {
      if (err) {
        return
      }
      this.x += dx
      this.y += dy
    })
  }
}

export default Controller

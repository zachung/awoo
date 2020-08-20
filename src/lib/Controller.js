import keyboardJS from 'keyboardjs'

const UP = Symbol('up')
const DOWN = Symbol('down')
const RIGHT = Symbol('right')
const LEFT = Symbol('left')
const Keys = {
  [UP]: 0,
  [DOWN]: 0,
  [RIGHT]: 0,
  [LEFT]: 0
}

const bindKey = (key, symbol, cb) => {
  keyboardJS.bind(
    key,
    e => {
      e.preventRepeat()
      Keys[symbol] = 1
      cb()
    },
    e => {
      Keys[symbol] = 0
      cb()
    }
  )
}

/**
 * @property {Item} item
 * @property {Messenger} messenger
 */
class Controller {
  constructor (options = {}) {
    this.waitingFeeback = false
    this.options = options
  }

  init (item, messenger) {
    this.messenger = messenger
    this.bindItem(item)
    this._bindInChat()
    this._bindInGame()
  }

  bindItem (item) {
    this.item = item
  }

  _bindInChat () {
    keyboardJS.setContext('in-chat')
    keyboardJS.bind(['enter', 'esc'], e => this.game())
  }

  _bindInGame () {
    const {
      up = 'up',
      down = 'down',
      right = 'right',
      left = 'left'
    } = this.options
    const cb = () => {
      if (this.moving) {
        return
      }
      this.moving = true
      this.startMove()
    }
    keyboardJS.setContext('in-game')
    bindKey(up, UP, cb)
    bindKey(down, DOWN, cb)
    bindKey(right, RIGHT, cb)
    bindKey(left, LEFT, cb)
    keyboardJS.bind('enter', e => {
      e.preventDefault()
      this.chat()
      this.onChating()
    })
    keyboardJS.bind('/', e => {
      e.preventDefault()
      this.chat()
      this.onChating('/')
    })
  }

  bindHelp (keyDown, keyUp) {
    const preContext = keyboardJS.getContext()
    keyboardJS.setContext('in-game')
    keyboardJS.bind('h', keyDown, keyUp)
    keyboardJS.setContext(preContext)
  }

  startMove () {
    // try move
    this._handle()
      .then(() => {
        // 12格: 也許是最適合操作的最快速度
        // 16格: 礙於 socket 往返時間的最高速度
        // 5格: 設定為初始速度
        const ceilSec = 10 // 每秒格數(ceil/sec)
        this.timer = setTimeout(() => {
          this.startMove()
        }, 1000 / ceilSec)
      })
      .catch(() => {
        this.moving = false
      })
  }

  _handle () {
    const dx = Keys[RIGHT] - Keys[LEFT]
    const dy = Keys[DOWN] - Keys[UP]
    if (dx === 0 && dy === 0) {
      // stop handle move
      return Promise.reject()
    }
    return this.move(dx, dy)
  }

  move (dx, dy) {
    const item = this.item
    if (this.waitingFeeback) {
      return Promise.resolve(item)
    }
    return new Promise(resolve => {
      this.waitingFeeback = true
      this.messenger.move(
        {
          name: item.name,
          x: this.item.globalX + dx,
          y: this.item.globalY + dy
        },
        err => {
          this.waitingFeeback = false
          // NOTICE: 不會拋錯誤
          resolve(item)
        }
      )
    })
  }

  registerChatElement (cb) {
    this.onChating = cb
  }

  chat () {
    keyboardJS.setContext('in-chat')
  }

  game () {
    keyboardJS.setContext('in-game')
  }
}

export default Controller

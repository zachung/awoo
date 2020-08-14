import Symbols from '../Symbols'

const radian = Math.PI / 180

class Canvas {
  constructor ({ pixelSize, debug }) {
    this.pixelSize = pixelSize
    this.debug = debug
  }

  bind (canvas) {
    this.canvas = canvas
  }

  render (world) {
    const canvas = this.canvas
    if (!canvas.getContext) {
      return
    }
    const length = world.length
    const size = length * this.pixelSize
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // init
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const origin = world[0][0][0]
    this.dx = origin.globalX - 2
    this.dy = origin.globalY - 2
    // start draw world
    world.forEach(row => {
      row.forEach(col => {
        col.forEach(item => {
          this._drawItem(ctx, item)
        })
      })
    })
  }

  _drawItem (ctx, item) {
    if (!item) {
      return
    }
    const symbol = Symbols[item.type][item.id]
    if (!symbol) {
      return
    }
    ctx.save()
    const pixelSize = this.pixelSize
    const halfPixel = pixelSize / 2
    ctx.font = `${pixelSize - 1}px Arial`
    const x = (item.globalX - this.dx) * pixelSize
    const y = (item.globalY - this.dy) * pixelSize
    // draw symbol
    const face = parseInt(item.props.face, 3)
    // debug grid
    if (this.debug) {
      ctx.strokeRect(x, y - pixelSize + 4, pixelSize, pixelSize)
    }
    ctx.textAlign = 'center'
    if (!Number.isNaN(face)) {
      ctx.save()
      const faces = [0, -90, 90, 180, 225, 135, 0, -45, 45]
      ctx.translate(x + halfPixel, y - 5)
      ctx.rotate(faces[face] * radian)
      ctx.fillText(symbol, 0, 5)
      ctx.restore()
    } else {
      // 置中
      ctx.fillText(symbol, x + halfPixel, y)
    }
    // draw name
    const name = item.props.name
    if (name) {
      ctx.save()
      ctx.fillText(name, x + halfPixel, y - pixelSize)
      ctx.restore()
    }
    ctx.restore()
  }
}

export default Canvas

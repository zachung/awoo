import { Chunk, Item, ItemData } from 'awoo-core'

const ChunkSize = 32
const round = p => ((p % ChunkSize) + ChunkSize) % ChunkSize
const chunkOffset = p => Math.floor(p / ChunkSize)

const chunksHandler = reader => {
  return {
    get (target, chunkName, receiver) {
      if (!target[chunkName]) {
        const chunk = Chunk.fromName(chunkName)
        target[chunkName] = chunk
        // TODO: handle missed chunk
        return chunk.loadWorld(reader).then(() => chunk)
      }
      return Promise.resolve(target[chunkName])
    }
  }
}

/**
 * @property {Number} viewSize
 * @property {Camera} camera
 * @preserve {ChunkReader} chunkReader
 * @preserve {Item} player
 */
class Stage {
  constructor ({ viewSize, camera }) {
    this.map = []
    // init fallback
    for (let x = 0; x < viewSize; x++) {
      this.map[x] = []
      for (let y = 0; y < viewSize; y++) {
        this.map[x][y] = []
      }
    }
    this.viewSize = viewSize
    this.camera = camera
  }

  setChunkReader (chunkReader) {
    this.chunkReader = chunkReader
  }

  renewChunks () {
    this.chunks = new Proxy({}, chunksHandler(this.chunkReader))
  }

  cameraFollow () {
    const x = this.camera.x
    const y = this.camera.y
    return this.loadNearChunks(x, y).then(() => {
      for (let mapX = 0; mapX < this.viewSize; mapX++) {
        for (let mapY = 0; mapY < this.viewSize; mapY++) {
          this.getChunkItem(mapX + x, mapY + y).then(items => {
            this.map[mapY].splice(mapX, 1, items)
          })
        }
      }
    })
  }

  loadNearChunks (x, y) {
    const chunkX = chunkOffset(x)
    const chunkY = chunkOffset(y)
    // check nearest chunk is loaded
    const loaders = []
    for (let x = chunkX - 1; x <= chunkX + 1; x++) {
      for (let y = chunkY - 1; y <= chunkY + 1; y++) {
        loaders.push(this.loadChunk(x, y))
      }
    }
    return Promise.all(loaders)
  }

  loadChunk (chunkX, chunkY) {
    const chunkName = Chunk.getChunkName(chunkX, chunkY)
    return this.chunks[chunkName]
  }

  /**
   * @param x
   * @param y
   * @return {Promise<Item[]>}
   */
  getChunkItem (x, y) {
    const offsetX = round(x)
    const offsetY = round(y)
    return this.getChunkByLoc(x, y).then(chunk => {
      return [chunk.groundLayer, chunk.itemLayer].map(layer => {
        return layer.getItem(offsetX, offsetY)
      })
    })
  }

  getChunkByLoc (x, y) {
    return this.loadChunk(chunkOffset(x), chunkOffset(y))
  }

  /**
   * @param {ItemData} itemData
   */
  replace (itemData) {
    const data = new ItemData(itemData)
    this.chunks[data.chunkName].then(chunk => {
      chunk.removeItem(data.x, data.y)
      const item = ItemData.fromJson(data)
      // TODO: check is current player
      const isPlayer = item.props.name === this.player.props.name
      let newItem

      if (isPlayer) {
        newItem = this.player
        newItem.setLocalPosition(item.x, item.y)
        newItem.props = item.props
      } else {
        newItem = item
      }
      chunk.addItem(newItem)
      if (isPlayer) {
        this.camera.gotoItem(newItem)
      }
    })
      .then(() => this.cameraFollow())
  }

  move (chunk, item, x, y) {
    const preX = item.x
    const preY = item.y

    return Promise.resolve().then(() => {
      this.getChunkByLoc(x, y).addItem(item, round(x), round(y))
      chunk.removeItem(preX, preY)
    })
  }

  save (cb) {
    return Promise.all(Object.values(this.chunks))
      .then(chunks => chunks.filter(chunk => chunk.isDirty))
      .then(cb)
      .then(chunks => {
        chunks.forEach(chunk => (chunk.isDirty = false))
      })
  }

  focusPlayer (x, y, name) {
    this.camera.goto(x, y)
    return this.cameraFollow()
      .then(() => this.getChunkItem(x, y))
      .then(items => {
        const player = items[1]
        this.camera.goto(x, y)
        player.color = '#226cff'
        player.name = name
        this.player = player
        return player
      })
  }
}

export default Stage

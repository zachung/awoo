import { Chunk } from 'awoo-core'

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
 * @property {Object} cameraDelta 鏡頭偏移(距離左上角距離)
 * @preserve {ChunkReader} chunkReader
 */
class Stage {
  constructor ({ viewSize, cameraDelta, chunkReader }) {
    this.chunks = new Proxy({}, chunksHandler(chunkReader))
    this.chunkReader = chunkReader

    this.map = []
    // init fallback
    for (let x = 0; x < viewSize; x++) {
      this.map[x] = []
      for (let y = 0; y < viewSize; y++) {
        this.map[x][y] = undefined
      }
    }
    this.viewSize = viewSize
    this.cameraDelta = cameraDelta
  }

  cameraGoTo (x, y) {
    x -= this.cameraDelta.x
    y -= this.cameraDelta.y
    return this.loadNearChunks(x, y).then(() => {
      for (let mapX = 0; mapX < this.viewSize; mapX++) {
        for (let mapY = 0; mapY < this.viewSize; mapY++) {
          this.getChunkItem(mapX + x, mapY + y).then(item => {
            if (item) {
              this.map[mapY].splice(mapX, 1, item)
            }
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

  getChunkItem (x, y) {
    return this.getChunkByLoc(x, y).then(chunk => {
      return chunk.getItem(round(x), round(y))
    })
  }

  getChunkByLoc (x, y) {
    const chunkInx = Chunk.getChunkName(chunkOffset(x), chunkOffset(y))
    return this.chunks[chunkInx]
  }

  move (chunk, item, x, y) {
    const preX = item.x
    const preY = item.y

    return Promise.resolve()
      .then(() => {
        this.getChunkByLoc(x, y).addItem(item, round(x), round(y))
        chunk.removeItem(preX, preY)
      })
  }

  save (cb) {
    return Promise.resolve(Object.values(this.chunks)
      .filter(chunk => chunk.isDirty))
      .then(cb)
      .then(chunks => {
        chunks.forEach(chunk => chunk.isDirty = false)
      })
  }

  reloadChunk (chunkName, chunkData) {
    this.chunks[chunkName].then(chunk => chunk.reloadWorld(this.chunkReader, chunkData))
  }
}

export default Stage

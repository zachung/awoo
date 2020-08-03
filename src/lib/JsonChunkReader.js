import { ChunkReader } from 'awoo-core'

class JsonChunkReader extends ChunkReader {
  /**
   * @param {Events} events
   */
  constructor (events) {
    super()
    this.events = events
  }

  fetchData (chunk) {
    return new Promise((resolve, reject) => {
      this.events.syncWorld(chunk, resolve)
    })
  }
}

export default JsonChunkReader

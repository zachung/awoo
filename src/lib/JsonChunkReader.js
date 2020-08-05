import { ChunkReader } from 'awoo-core'

class JsonChunkReader extends ChunkReader {
  /**
   * @param {Messenger} messenger
   */
  constructor (messenger) {
    super()
    this.messenger = messenger
  }

  fetchData (chunk) {
    return new Promise((resolve, reject) => {
      this.messenger.syncWorld(chunk, resolve)
    })
  }
}

export default JsonChunkReader

import { ChunkReader } from 'awoo-core';

class JsonChunkReader extends ChunkReader {
  fetchData(chunk) {
    return this.getJSON("world/" + chunk + ".json");
  }

  getJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "json";
      xhr.onload = () => {
        const status = xhr.status;
        if (status === 200) {
          resolve(xhr.response);
        } else {
          reject(status, xhr.response);
        }
      };
      xhr.send();
    });
  }
}

export default JsonChunkReader;

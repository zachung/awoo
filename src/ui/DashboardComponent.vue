<template>
  <div>
    <div v-if="player">
      <div>
        Position:
        {{ player.globalX }}, {{ player.globalY }} ({{
          player.chunk.chunkName
        }})
      </div>
    </div>
    <button @click="save">save</button>
    <button @click="setEnable(!isEnable)">
      {{ isEnable ? "Done" : "Edit Map" }}
    </button>
    <symbols-component v-if="isEnable"></symbols-component>
    <ul>
      <li v-for="log in logs" :class="log.level">
        {{ log.time }} [{{ log.level }}]{{ log.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SymbolsComponent from "./SymbolsComponent.vue";
import Messages from '../lib/Messages'

export default {
  components: {
    SymbolsComponent
  },
  props: {
    game: Object,
    player: Object
  },
  computed: {
    ...mapGetters("editor", ["isEnable"])
  },
  data() {
    return {
      logs: []
    }
  },
  methods: {
    ...mapActions("editor", ["setEnable"]),
    save() {
      this.game.save(chunk => {
        const exportObj = chunk.export();
        const exportName = chunk.chunkName;
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(exportObj));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    },
    pushLog(log) {
      const length = this.logs.push(log)
      if (length > 10) {
        this.logs.shift()
      }
    }
  },
  mounted () {
    Messages.onLogging(log => this.pushLog(log))
  }
};
</script>

<style scoped>
.info {
  color: green;
}
.error {
  color: red;
}
</style>

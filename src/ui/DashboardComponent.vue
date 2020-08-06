<template>
  <div>
    <div class="server-status-panel">
      <h4>Game Status</h4>
      <div v-if="game.isOn">current players: {{ game.currentOnline }}</div>
      <div v-else-if="game.isConnected" class="info">Take your name</div>
      <div v-else class="info">Choice server first</div>
    </div>
    <div class="player-status-panel">
      <h4>Player</h4>
      <div v-if="player">
        Position:
        {{ player.globalX }}, {{ player.globalY }} ({{
          player.chunk.chunkName
        }})
      </div>
      <ul class="messages">
        <template v-for="log in logs">
          <li v-if="log.type === Types.CHAT">
            {{ log.time }} [{{ log.name }}]{{ log.message }}
          </li>
          <li v-else :class="log.level">
            {{ log.time }} [{{ log.level }}]{{ log.message }}
          </li>
        </template>
      </ul>
      <label v-if="player">
        >
        <input
          v-model="message"
          type="text"
          @keypress.enter.prevent="sendMessage"
          @focus="game.controller.disable()"
          placeholder="say something"
        />
      </label>
    </div>
    <div class="secret-functions">
      <h5>secret functions</h5>
      <button @click="save">save</button>
      <button @click="setEnable(!isEnable)">
        {{ isEnable ? "Done" : "Edit Map" }}
      </button>
      <symbols-component v-if="isEnable"></symbols-component>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SymbolsComponent from "./SymbolsComponent.vue";
import Messages, { Types } from "../lib/Messages";

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
      Types,
      message: "",
      logs: [],
      keepMaxMsgCount: 20
    };
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
      const length = this.logs.push(log);
      if (length > this.keepMaxMsgCount) {
        this.logs.shift();
      }
    },
    sendMessage() {
      this.game.messenger.say(this.message);
      this.message = "";
    }
  },
  mounted() {
    Messages.onLogging(log => this.pushLog(log));
  }
};
</script>

<style scoped>
.server-status-panel,
.player-status-panel,
.secret-functions {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0 1em 1em;
  margin-bottom: 1em;
}
.messages {
  height: 10em;
  overflow: scroll;
}
.info {
  color: green;
}
.error {
  color: red;
}
</style>

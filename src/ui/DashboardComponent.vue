<template>
  <div>
    <div class="status-panel">
      <h4>Status</h4>
      <div v-if="game.isOn">current players: {{ game.currentOnline }}</div>
      <div v-else-if="game.isConnected" class="info">Take your name</div>
      <div v-else class="info">Choice server first</div>
      <div class="player-container" v-if="player">
        <p>Player</p>
        <ul class="player-property">
          <li>
            <label>Position:</label>
            <span>
              ({{ player.globalX }}, {{ player.globalY }})
              {{ player.chunk.chunkName }}
            </span>
          </li>
          <li>
            <label>Props:</label>
            <span>{{ player.props }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-panel">
      <h4>Chat</h4>
      <ul class="messages">
        <template v-for="log in logs">
          <li v-if="log.type === Types.CHAT">
            <span
              class="name"
              :class="{ 'is-self': log.name === player.props.name }"
              >{{ log.name }}</span
            >: {{ log.message }}
          </li>
          <li v-else :class="log.level">[{{ log.level }}]{{ log.message }}</li>
        </template>
        <li class="scroll-to-here"></li>
      </ul>
      <label v-show="player">
        >
        <input
          v-model="message"
          type="text"
          ref="messageBox"
          @keypress.enter="sendMessage"
          @keydown.esc="escapeChatBox"
          @keydown.up="selectMessage"
          @keydown.down="selectMessage"
          @focus="game.controller.chat()"
          @blur="game.controller.game()"
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
  watch: {
    logs() {
      // keep chat scroll to bottom
      document.getElementsByClassName("scroll-to-here")[0].scrollIntoView();
    }
  },
  data() {
    return {
      Types,
      message: "",
      logs: [],
      preMessages: [],
      selectedMessageInx: 0,
      maxKeepMsgCount: 50,
      maxPreMessageCount: 20
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
      if (length > this.maxKeepMsgCount) {
        this.logs.shift();
      }
    },
    sendMessage() {
      this.$refs.messageBox.blur();
      const message = this.message;
      if (!message) {
        return;
      }
      if (message.startsWith("/")) {
        const strings = message.substr(1).split(" ");
        this.game.messenger.command(strings.shift(), ...strings);
      } else {
        this.game.messenger.say(message);
      }
      this.message = "";
      // remember pre messages
      const length = this.preMessages.push(message);
      if (length > this.maxPreMessageCount) {
        this.preMessages.shift();
      }
    },
    escapeChatBox() {
      this.$refs.messageBox.blur();
    },
    selectMessage(e) {
      e.preventDefault();
      const offset = e.key === "ArrowUp" ? -1 : 1;
      const number = this.selectedMessageInx + offset;
      const max = Math.min(this.preMessages.length, this.maxPreMessageCount);
      this.selectedMessageInx = ((number % max) + max) % max;
      this.message = this.preMessages[this.selectedMessageInx];
    }
  },
  mounted() {
    Messages.onLogging(log => this.pushLog(log));
    this.game.controller.registerChatElement(this.$refs.messageBox);
  }
};
</script>

<style lang="scss" scoped>
.status-panel,
.player-container,
.chat-panel,
.secret-functions {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0 1em 1em;
  margin-bottom: 1em;
}
.status-panel {
  .player-property {
    list-style: none;
    padding-left: 0;
    font-family: monospace;

    label {
      width: 5em;
      display: inline-block;
    }
  }
}
.player-container {
  margin: 0;
}
.chat-panel {
  .messages {
    height: 10em;
    overflow: scroll;
  }
}
.info {
  color: green;
}
.error {
  color: red;
}
.scroll-to-here {
  visibility: hidden;
}
</style>

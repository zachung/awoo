<template>
  <div class="chat-panel" :class="{ chatting: isChatKeying }">
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
      <li class="scroll-to-here">&nbsp;</li>
    </ul>
    <label
      id="message_box"
      v-show="player"
      :style="{ visibility: isChatKeying ? 'visible' : 'hidden' }"
    >
      >
      <input
        v-model="message"
        type="text"
        ref="messageBox"
        @keypress.enter="sendMessage"
        @keydown.esc="escapeChatBox"
        @keydown.up="selectMessage"
        @keydown.down="selectMessage"
        @focus="chatFocus"
        @blur="chatBlur"
        placeholder="say something"
      />
    </label>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Messages, { Types } from "../lib/Messages";

export default {
  props: {
    game: Object,
    player: Object
  },
  computed: {
    ...mapGetters("ui", ["isChatKeying"])
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
      logs: [{ level: "info", message: "press 'H' for help" }],
      preMessages: [],
      selectedMessageInx: 0,
      maxKeepMsgCount: 50,
      maxPreMessageCount: 20
    };
  },
  methods: {
    ...mapActions("ui", ["setChatKeying"]),
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
      // back to last one
      this.selectedMessageInx = 0;
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
    },
    chatFocus() {
      this.game.controller.chat();
    },
    chatBlur() {
      this.game.controller.game();
      this.setChatKeying(false);
    },
    switchToKeyingMode(msg = "") {
      this.setChatKeying(true);
      this.$nextTick(() => {
        this.$refs.messageBox.value = msg;
        this.$refs.messageBox.focus();
      });
    }
  },
  mounted() {
    Messages.onLogging(log => this.pushLog(log));
    this.game.controller.registerChatElement(msg => {
      this.switchToKeyingMode(msg);
    });
  }
};
</script>

<style scoped></style>

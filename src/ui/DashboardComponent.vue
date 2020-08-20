<template>
  <div>
    <div style="float: right">
      <button v-if="!isShowDashboard" @click="isShowDashboard = true">
        show
      </button>
      <button v-else @click="isShowDashboard = false">hide</button>
    </div>
    <div v-if="isShowDashboard">
      <div class="status-panel popup-window">
        <h4>Status</h4>
        <div v-if="game.isOn">current players: {{ game.currentOnline }}</div>
        <div v-else-if="game.isConnected" class="info">Take your name</div>
        <div v-else class="info">Choice server first</div>
        <div class="player-container popup-window" v-if="player">
          <div style="float: right">
            <label v-if="!this.isSubscribed">
              <button
                type="button"
                @click.prevent="subscribe"
                :disabled="switchingSubscribe"
              >
                開啟通知
              </button>
            </label>
            <label v-else>
              <button
                type="button"
                @click.prevent="unsubscribe"
                :disabled="switchingSubscribe"
              >
                關閉通知
              </button>
            </label>
          </div>
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
      <div class="secret-functions popup-window">
        <h5>secret functions</h5>
        <button @click="save">save</button>
        <button @click="setEnable(!isEnable)">
          {{ isEnable ? "Done" : "Edit Map" }}
        </button>
        <symbols-component v-if="isEnable"></symbols-component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SymbolsComponent from "./SymbolsComponent.vue";
import Messages from "../lib/Messages";

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
      isShowDashboard: false,
      isSubscribed: this.game.serviceWorkerRegister.isSubscribed,
      switchingSubscribe: false
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
    subscribe() {
      this.switchingSubscribe = true;
      this.game
        .subscribe()
        .then(() => (this.isSubscribed = true))
        .catch(err => {
          Messages.error("Failed to subscribe the user: ", err);
        })
        .finally(() => (this.switchingSubscribe = false));
    },
    unsubscribe() {
      this.switchingSubscribe = true;
      this.game
        .unsubscribe()
        .then(() => (this.isSubscribed = false))
        .catch(error => {
          Messages.error("Error unsubscribing", error);
        })
        .finally(() => (this.switchingSubscribe = false));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

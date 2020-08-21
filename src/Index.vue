<template>
  <div id="app" class="no-select" @contextmenu.prevent="">
    <div class="container">
      <world-component
        :world="game.stage.map"
        v-if="game.isOn"
      ></world-component>
      <connect-component
        v-else
        :game="game"
        @start="start"
        ref="connectComponent"
      ></connect-component>
    </div>
    <ui-component :game="game" :player="game.player"></ui-component>
    <footer-component></footer-component>
  </div>
</template>

<script>
import Game from "./lib/Game";
import CanvasWorldComponent from "./ui/CanvasWorldComponent.vue";
import FooterComponent from "./ui/FooterComponent.vue";
import ConnectComponent from "./ui/ConnectComponent.vue";
import UiComponent from "./ui/UiComponent.vue";
import { ServerHost, Env } from "./lib/Env";

export default {
  components: {
    ConnectComponent,
    WorldComponent: CanvasWorldComponent,
    FooterComponent,
    UiComponent
  },
  data() {
    const viewSize = Math.min(
      Math.floor(document.body.clientWidth / 20),
      Math.floor(document.body.clientHeight / 20)
    );
    const delta = Math.floor(-viewSize / 2);
    const game = new Game({
      viewSize,
      cameraDelta: { x: delta, y: delta }
    });
    return {
      game,
      viewSize
    };
  },
  methods: {
    start(name, cb) {
      const promise = this.game.start(name);
      cb(promise);
    }
  },
  mounted() {
    this.game.connect(ServerHost, () => {
      if (Env === "dev") {
        this.start("brian", () => {});
        return;
      }
      this.$nextTick(() => {
        this.$refs.connectComponent.focusNameInput();
      });
    });
  }
};
</script>

<style scoped></style>

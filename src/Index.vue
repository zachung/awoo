<template>
  <div id="app" class="no-select" @contextmenu.prevent="">
    <div class="container">
      <world-component
        :world="game.stage.map"
        v-if="game.isOn"
      ></world-component>
      <connect-component v-else :game="game" @start="start"></connect-component>
      <dashboard-component
        class="dashboard"
        :game="game"
        :player="game.player"
      ></dashboard-component>
    </div>
    <control-instruction-component></control-instruction-component>
    <footer-component></footer-component>
  </div>
</template>

<script>
import Game from "./lib/Game";
import CanvasWorldComponent from "./ui/CanvasWorldComponent.vue";
import DashboardComponent from "./ui/DashboardComponent.vue";
import FooterComponent from "./ui/FooterComponent.vue";
import ConnectComponent from "./ui/ConnectComponent.vue";
import ControlInstructionComponent from "./ui/ControlInstructionComponent.vue";
import { ServerHost, Env } from "./lib/Env";

export default {
  components: {
    ConnectComponent,
    WorldComponent: CanvasWorldComponent,
    DashboardComponent,
    FooterComponent,
    ControlInstructionComponent
  },
  data() {
    const viewSize = Math.floor(window.innerWidth / 20);
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
      }
    });
  }
};
</script>

<style scoped></style>

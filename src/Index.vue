<template>
  <div id="app" class="no-select" @contextmenu.prevent="">
    <div class="container">
      <world-component
        id="world"
        :style="worldStyle"
        :game="game"
        v-if="game.isOn"
      ></world-component>
      <connect-component
        v-else
        :game="game"
        @connect="connect"
        @start="start"
      ></connect-component>
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
import WorldComponent from "./ui/WorldComponent.vue";
import DashboardComponent from "./ui/DashboardComponent.vue";
import FooterComponent from "./ui/FooterComponent.vue";
import ConnectComponent from "./ui/ConnectComponent.vue";
import ControlInstructionComponent from "./ui/ControlInstructionComponent.vue";
import ServiceWorkerRegister from "./service_worker/ServiceWorkerRegister";

export default {
  components: {
    ConnectComponent,
    WorldComponent,
    DashboardComponent,
    FooterComponent,
    ControlInstructionComponent
  },
  data() {
    const viewSize = 30;
    const delta = Math.floor(-viewSize / 2);
    const game = new Game({
      viewSize,
      cameraDelta: { x: delta, y: delta }
    });
    const serviceWorkerRegister = new ServiceWorkerRegister();
    serviceWorkerRegister.register();
    return {
      game,
      viewSize,
      serviceWorkerRegister
    };
  },
  computed: {
    worldStyle() {
      return {
        display: "inline-grid",
        "grid-template-rows": "repeat(" + this.viewSize + ", 1em)",
        "grid-template-columns": "repeat(" + this.viewSize + ", 1em)"
      };
    }
  },
  methods: {
    connect(uri) {
      this.game.connect(uri);
    },
    start(name, cb) {
      const promise = this.game.start(name).then(() => {
        this.serviceWorkerRegister.subscribe(this.game.messenger);
      });
      cb(promise);
    }
  },
  mounted() {
    // this.connect("//localhost:3000");
    // setTimeout(() => {
    //   this.start("brian", () => {});
    // }, 10);
  }
};
</script>

<style scoped></style>

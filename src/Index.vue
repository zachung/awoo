<template>
  <div>
    <div class="container no-select">
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
    return {
      game,
      viewSize
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
      const promise = this.game.start(name);
      cb(promise);
    }
  },
  mounted() {}
};
</script>

<style scoped></style>

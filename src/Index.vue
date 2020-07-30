<template>
  <div>
    <div class="container no-select">
      <world-component
        id="world"
        :style="worldStyle"
        :game="game"
        v-if="game.isOn"
      ></world-component>
      <dashboard-component
        class="dashboard"
        :game="game"
        :player="game.player"
      ></dashboard-component>
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import Controller from "./lib/Controller";
import Game from "./lib/Game";
import WorldComponent from "./ui/WorldComponent.vue";
import DashboardComponent from "./ui/DashboardComponent.vue";
import FooterComponent from "./ui/FooterComponent.vue";

export default {
  components: {
    WorldComponent,
    DashboardComponent,
    FooterComponent
  },
  data() {
    const viewSize = 30;
    const game = new Game({
      viewSize,
      cameraDelta: { x: 16, y: 16 }
    });
    return {
      game: game,
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
  mounted() {
    this.game.start().then(player => {
      player.color = "#226cff";
      new Controller(player, { up: "w", down: "s", left: "a", right: "d" });
    });
  }
};
</script>

<style scoped></style>

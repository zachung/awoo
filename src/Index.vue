<template>
  <div>
    <div class="container no-select">
      <world-component
        id="world"
        :style="worldStyle"
        :game="game"
        v-if="game.isOn"
        ref="worldComponent"
      ></world-component>
      <connect-component v-else @connect="start"></connect-component>
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
import ConnectComponent from "./ui/ConnectComponent.vue";

export default {
  components: {
    ConnectComponent,
    WorldComponent,
    DashboardComponent,
    FooterComponent
  },
  data() {
    const viewSize = 30;
    const game = new Game({
      viewSize,
      cameraDelta: { x: -16, y: -16 }
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
    start(uri, name) {
      this.game
        .start(uri, name, () => {
          this.$refs.worldComponent.render();
        })
        .then(player => {
          player.color = "#226cff";
          new Controller(player, {
            up: "w",
            down: "s",
            left: "a",
            right: "d",
            events: this.game.events
          });
        });
    }
  },
  mounted() {}
};
</script>

<style scoped></style>

<template>
  <div class="container no-select">
    <world-component
      id="world"
      :style="worldStyle"
      :game="game"
      v-if="game.isOn"
    ></world-component>
    <div class="dashboard">
      <div v-if="game.player">
        <div>
          Position:
          {{ game.player.globalX }}, {{ game.player.globalY }} ({{
            game.player.chunk.chunkName
          }})
        </div>
      </div>
      <button @click="setEnable(true)" :disabled="isEnable">Edit</button>
      <button @click="setEnable(false)" :disabled="!isEnable">Done</button>
      <symbols-component v-if="isEnable"></symbols-component>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Controller from "./lib/Controller";
import Game from "./lib/Game";
import SymbolsComponent from "./ui/SymbolsComponent.vue";
import WorldComponent from "./ui/WorldComponent.vue";

export default {
  components: {
    SymbolsComponent,
    WorldComponent
  },
  data() {
    const viewSize = 50;
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
    ...mapGetters("editor", ["isEnable"]),
    worldStyle() {
      return {
        display: "inline-grid",
        "grid-template-rows": "repeat(" + this.viewSize + ", 1em)",
        "grid-template-columns": "repeat(" + this.viewSize + ", 1em)"
      };
    }
  },
  methods: {
    ...mapActions("editor", ["setEnable"])
  },
  mounted() {
    this.game.start().then(player => {
      player.color = "#226cff";
      new Controller(player, { up: "w", down: "s", left: "a", right: "d" });
    });
  }
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
#world {
  width: 50em;
  height: 50em;
  overflow: hidden;
}
.dashboard {
  display: inline-block;
  padding: 0.5em;
  border: 5px ridge gray;
}
.no-select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>

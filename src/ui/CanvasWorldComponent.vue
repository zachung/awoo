<template>
  <div>
    <canvas ref="world" :class="{ editing: isEnable }"> </canvas>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Item } from "awoo-core";
import TileComponent from "./TileComponent.vue";
import Canvas from "../lib/renderer/Canvas";

const { mapGetters } = createNamespacedHelpers("editor");

export default {
  components: {
    TileComponent
  },
  props: {
    world: Array
  },
  computed: {
    ...mapGetters(["isEnable", "selectedId", "selectedType"]),
    tileClass() {
      const newVar = {
        editing: this.isEnable,
        replace: this.selectedId !== undefined
      };
      // show current selected symbol
      const symbol = "symbol-" + this.selectedType + "-" + this.selectedId;
      newVar[symbol] = this.isEnable;
      return newVar;
    }
  },
  data() {
    return {
      canvas: new Canvas({
        pixelSize: 22,
        debug: false
      })
    };
  },
  watch: {
    world() {
      console.log("need rerender");
      this.canvas.render(this.world);
    }
  },
  methods: {
    changeSymbol(item) {
      if (!this.isEnable) {
        return;
      }
      if (this.selectedType === undefined) {
        return;
      }
      item.removeSelf();
      const newItem = new Item({
        type: this.selectedType,
        id: this.selectedId,
        x: item.x,
        y: item.y
      });
      newItem.setIn(item.chunk);
    },
    removeSymbol(item) {
      if (!this.isEnable) {
        return;
      }
      item.removeSelf();
    }
  },
  mounted() {
    this.canvas.bind(this.$refs.world);
    this.canvas.render(this.world);
  }
};
</script>

<style scoped></style>

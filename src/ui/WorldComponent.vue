<template>
  <div :class="{ editing: isEnable }">
    <template v-for="row in game.stage.map" class="tile">
      <div
        v-for="item in row"
        class="tile"
        :class="tileClass"
        :style="tileStyle(item)"
        :data-x="item.globalX"
        :data-y="item.globalY"
        :data-chunk="item.chunk ? item.chunk.chunkName : ''"
        @click="changeSymbol(item)"
        v-if="item"
        @contextmenu.prevent="removeSymbol(item)"
        v-html="item.symbol"
      ></div>
      <div class="tile" v-else></div>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Item, Symbols } from "awoo-core";

const { mapGetters, mapActions } = createNamespacedHelpers("editor");

export default {
  name: "WorldComponent",
  props: {
    game: Object
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
      newVar[symbol] = true;
      return newVar;
    },
    selectedSymbol() {
      if (this.selectedType === undefined) {
        return;
      }
      return this.Symbols[this.selectedType][this.selectedId];
    }
  },
  data() {
    return {
      Symbols
    };
  },
  methods: {
    tileStyle(item) {
      return {
        color: item.color,
        "background-color": item.bgColor
      };
    },
    changeSymbol(item) {
      if (!this.isEnable) {
        return;
      }
      if (this.selectedSymbol === undefined) {
        return;
      }
      item.removeSelf();
      new Item({
        symbol: this.selectedSymbol,
        x: item.x,
        y: item.y
      }).setIn(item.chunk);
    },
    removeSymbol(item) {
      if (!this.isEnable) {
        return;
      }
      item.removeSelf();
    }
  },
  mounted() {}
};
</script>

<style scoped></style>

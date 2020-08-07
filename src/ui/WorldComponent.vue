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
        @contextmenu.prevent="removeSymbol(item)"
      >
        <template v-if="isUrl(item)">
          <img :src="symbol(item)" alt="" />
        </template>
        <div v-else>
          <div v-if="item.props.name" class="tile-name">
            {{ item.props.name }}
          </div>
          <div v-html="symbol(item)"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Item } from "awoo-core";
import Symbols from "../lib/Symbols";

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
      newVar[symbol] = this.isEnable;
      return newVar;
    }
  },
  data() {
    return {
      Symbols
    };
  },
  methods: {
    symbol(item) {
      if (item.type === undefined) {
        return "";
      }
      return this.Symbols[item.type][item.id];
    },
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
    },
    isUrl(item) {
      const symbol = this.symbol(item);
      return symbol !== undefined && symbol.length > 10;
    }
  },
  mounted() {}
};
</script>

<style scoped>
.tile-name {
  position: absolute;
  top: -1em;
  left: -5em;
  width: 11em;
  text-align: center;
}
</style>

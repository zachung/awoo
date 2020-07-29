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
      >
        {{ item.symbol }}
      </div>
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
      this.removeSymbol(item);
      if (this.selectedSymbol === undefined) {
        return;
      }
      const newItem = new Item(this.selectedSymbol);
      item.chunk.addItem(newItem, item.x, item.y);
      newItem.x = item.x;
      newItem.y = item.y;
    },
    removeSymbol(item) {
      if (!this.isEnable) {
        return;
      }
      item.chunk.removeItem(item, item.x, item.y);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
#world {
  &.editing {
    border-top: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
  }
}
.tile {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;

  &.editing {
    border-bottom: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
  }
  &.replace {
    cursor: none;

    &:hover {
      border: 1px solid red;
    }
  }
}
</style>

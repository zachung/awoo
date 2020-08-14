<template>
  <div :class="{ editing: isEnable }">
    <template v-for="row in game.stage.map" class="tile">
      <div v-for="items in row" class="tile" :class="tileClass">
        <tile-component v-if="items[0]" :item="items[0]"></tile-component>
        <tile-component
          v-if="items[1]"
          :item="items[1]"
          @click="changeSymbol(items[1])"
          @contextmenu.prevent="removeSymbol(items[1])"
        ></tile-component>
      </div>
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Item } from "awoo-core";
import TileComponent from "./TileComponent.vue";

const { mapGetters } = createNamespacedHelpers("editor");

export default {
  components: {
    TileComponent
  },
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
  mounted() {}
};
</script>

<style scoped></style>

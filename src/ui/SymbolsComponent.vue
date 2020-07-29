<template>
  <div>
    <div v-for="(symbols, type) in Symbols">
      <h6>{{ type }}</h6>
      <div class="symbol-panel">
        <div
          v-for="(symbol, id) in symbols"
          class="tile"
          @click="selectSymbol(id, type)"
          :class="{
            enabled: id === selectedId && type === selectedType
          }"
        >
          {{ symbol }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { Symbols } from "awoo-core";

const { mapGetters, mapActions } = createNamespacedHelpers("editor");

export default {
  data() {
    return {
      Symbols
    };
  },
  computed: {
    ...mapGetters(["selectedId", "selectedType"])
  },
  methods: {
    ...mapActions(["setChoiceSymbol"]),
    selectSymbol(id, type) {
      this.setChoiceSymbol({ id, type });
    }
  }
};
</script>

<style scoped>
.symbol-panel {
  display: inline-grid;
  grid-template-columns: repeat(10, 1fr);
}

.tile {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  border: 1px solid gray;
  width: 2em;
  height: 2em;
  box-sizing: border-box;
  cursor: pointer;
}
.enabled {
  background-color: crimson;
}
</style>

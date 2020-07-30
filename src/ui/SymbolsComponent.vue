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
          v-html="symbol"
        ></div>
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

<style scoped></style>

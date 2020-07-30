<template>
  <div>
    <div v-for="(symbols, type) in Symbols">
      <h6>{{ TypeKeys[type] }}</h6>
      <div class="symbol-panel">
        <div
          v-for="(symbol, id) in symbols"
          class="tile"
          @click="selectSymbol(id, type)"
          :class="{
            enabled: id === selectedId && type === selectedType
          }"
        >
          <template v-if="symbol.length > 10">
            <img :src="symbol" alt="" />
          </template>
          <div v-else v-html="symbol"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import Symbols from "../lib/Symbols";

const { mapGetters, mapActions } = createNamespacedHelpers("editor");

export default {
  data() {
    return {
      Symbols,
      TypeKeys: ["Grounds", "Blocks", "Items"]
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

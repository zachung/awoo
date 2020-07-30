<template>
  <div>
    <div v-if="player">
      <div>
        Position:
        {{ player.globalX }}, {{ player.globalY }} ({{
          player.chunk.chunkName
        }})
      </div>
    </div>
    <button @click="setEnable(true)" :disabled="isEnable">Edit</button>
    <button @click="setEnable(false)" :disabled="!isEnable">Done</button>
    <symbols-component v-if="isEnable"></symbols-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SymbolsComponent from "./SymbolsComponent.vue";

export default {
  components: {
    SymbolsComponent
  },
  props: {
    player: Object
  },
  computed: {
    ...mapGetters("editor", ["isEnable"])
  },
  methods: {
    ...mapActions("editor", ["setEnable"])
  }
};
</script>

<style scoped></style>

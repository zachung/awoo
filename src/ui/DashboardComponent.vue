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
    <button @click="save">save</button>
    <button @click="setEnable(!isEnable)">
      {{ isEnable ? "Done" : "Edit Map" }}
    </button>
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
    game: Object,
    player: Object
  },
  computed: {
    ...mapGetters("editor", ["isEnable"])
  },
  methods: {
    ...mapActions("editor", ["setEnable"]),
    save() {
      this.game.save(chunk => {
        const exportObj = chunk.export();
        const exportName = chunk.chunkName;
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(exportObj));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    }
  }
};
</script>

<style scoped></style>

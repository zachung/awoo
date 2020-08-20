<template>
  <div>
    <dashboard-component
      class="dashboard"
      :game="game"
      :player="player"
    ></dashboard-component>
    <chat-component :game="game" :player="player"></chat-component>
    <control-instruction-component></control-instruction-component>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ChatComponent from "./ChatComponent.vue";
import ControlInstructionComponent from "./ControlInstructionComponent.vue";
import DashboardComponent from "./DashboardComponent.vue";

export default {
  components: {
    ChatComponent,
    ControlInstructionComponent,
    DashboardComponent
  },
  props: {
    game: Object,
    player: Object
  },
  methods: {
    ...mapActions("ui", ["setControlShow"])
  },
  mounted() {
    this.game.controller.bindHelp(
      e => {
        this.setControlShow(true);
      },
      e => {
        this.setControlShow(false);
      }
    );
  }
};
</script>

<style scoped></style>

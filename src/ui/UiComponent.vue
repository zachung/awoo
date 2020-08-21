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
  }
};
</script>

<style scoped></style>

<template>
  <div class="control-instruction popup-window" v-show="isControlShow">
    <div class="grid">
      <template v-for="hotkey in hotkeys">
        <div class="hotkey" v-if="Array.isArray(hotkey.keys)">
          <pre class="key" v-for="key in hotkey.keys">{{ key }}</pre>
        </div>
        <pre class="hotkey key" v-else>{{ hotkey.keys }}</pre>
        <label class="desc">{{ hotkey.desc }}</label>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("ui", ["isControlShow"])
  },
  data() {
    return {
      hotkeys: [
        { keys: "H", desc: "Switch this help window" },
        { keys: "A", desc: "Left" },
        { keys: "W", desc: "Up" },
        { keys: "S", desc: "Down" },
        { keys: "D", desc: "Right" },
        { keys: "F3", desc: "Dashboard" },
        { keys: "Enter", desc: "Chat focus}" }
      ]
    };
  }
};
</script>

<style scoped></style>

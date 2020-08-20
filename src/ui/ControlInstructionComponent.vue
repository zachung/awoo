<template>
  <div class="control-instruction popup-window" v-show="isControlShow">
    <div>
      <label>Move</label>
      <pre class="hotkey">A</pre>
      ,
      <pre class="hotkey">W</pre>
      ,
      <pre class="hotkey">S</pre>
      ,
      <pre class="hotkey">D</pre>
    </div>
    <div>
      <label>Chat focus</label>
      <pre class="hotkey">Enter</pre>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("ui", ["isControlShow"])
  },
};
</script>

<style scoped></style>

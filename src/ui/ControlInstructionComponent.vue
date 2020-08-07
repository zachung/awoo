<template>
  <div class="control-instruction">
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
export default {
  name: "ControlInstructionComponent"
};
</script>

<style scoped>
.control-instruction {
  padding: 1em;
}
.hotkey {
  display: inline-block;
  background-color: #f0f0f0;
  font-family: monospace;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 0 5px;
}
</style>

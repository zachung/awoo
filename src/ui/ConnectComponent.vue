<template>
  <div>
    <label for="uri">server uri</label>
    <input id="uri" v-model="uri" type="text" />
    <label for="name">name</label>
    <input id="name" v-model="name" type="text" />
    <button @click="$emit('connect', uri, name)">Connect</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uri: "http://localhost:3000",
      name: ""
    };
  }
};
</script>

<style scoped></style>

<template>
  <div>
    <input v-model="name" type="text" />
    <button @click="$emit('connect', name)">Connect</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ""
    };
  }
};
</script>

<style scoped></style>

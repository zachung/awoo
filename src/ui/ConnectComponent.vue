<template>
  <div>
    <form action="#" @submit.prevent="connect">
      <label for="uri">server uri</label>
      <input id="uri" v-model="uri" type="text" />
      <label for="name">name</label>
      <input id="name" v-model="name" type="text" />
      <button type="submit">Connect</button>

      <div v-if="errors.length" style="color: red">
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
      uri: "http://localhost:3000",
      name: "",
      isConnecting: false
    };
  },
  methods: {
    connect() {
      this.errors = [];
      if (!this.name) {
        this.errors.push("Name required.");
        return;
      }
      if (!this.uri) {
        this.errors.push("Server uri required.");
        return;
      }
      if (this.isConnecting) {
        return;
      }
      this.isConnecting = true;
      this.$emit("connect", this.uri, this.name);
    }
  }
};
</script>

<style scoped></style>

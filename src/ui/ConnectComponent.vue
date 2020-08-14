<template>
  <div class="connect-container">
    <div v-if="!game.isConnected">
      <h3>連線中...</h3>
    </div>
    <form action="#" @submit.prevent="login" v-else>
      <label for="name">name</label>
      <input id="name" v-model="name" type="text" />
      <button type="submit" :disabled="nowLogin">Login</button>
    </form>
    <div v-if="errors.length" style="color: red">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Messages from "../lib/Messages";

export default {
  props: {
    game: Object
  },
  data() {
    return {
      errors: [],
      name: "brian",
      nowLogin: false
    };
  },
  methods: {
    login() {
      this.errors = [];
      if (!this.name) {
        this.errors.push("Name required.");
        return;
      }
      if (this.nowLogin) {
        return;
      }
      this.nowLogin = true;
      this.$emit("start", this.name, promise => {
        promise.catch(err => {
          Messages.error(err);
          this.nowLogin = false;
        });
      });
    }
  }
};
</script>

<style scoped>
.connect-container {
  margin: 0 2em;
}
.server-list li {
  margin-bottom: .5em;
}
</style>

<template>
  <div class="connect-container">
    <form action="#" @submit.prevent="customConnect" v-if="!game.isConnected">
      <h3>Server List</h3>
      <ul class="server-list">
        <li>
          <button @click.prevent="connect(defaultHost)">awoo-server</button>
        </li>
        <li>
          <button @click.prevent="connect(localHost)">localhost</button>
        </li>
        <li>
          <button type="submit">Custom</button>
          <input v-model="uri" type="text" placeholder="uri" />
        </li>
      </ul>
    </form>
    <form action="#" @submit.prevent="login" v-if="game.isConnected">
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

const localHost = "//localhost:3000";
const defaultHost = "//awoo-server.zachung.net";

export default {
  props: {
    game: Object
  },
  data() {
    return {
      errors: [],
      localHost,
      defaultHost,
      uri: "",
      name: "brian",
      nowLogin: false
    };
  },
  methods: {
    customConnect() {
      this.errors = [];
      if (!this.uri) {
        this.errors.push("Server uri required.");
        return;
      }
      if (this.game.connecting) {
        return;
      }
      this.connect(this.uri);
    },
    connect(uri) {
      this.$emit("connect", uri);
    },
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

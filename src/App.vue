<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <span v-if="!token">
      <router-link to="/login">Logowanie</router-link> |
    </span>
    <span v-if="!token">
      <router-link to="/register">Rejestracja</router-link>
    </span>
    <router-link v-if="token !== ''" to="/" v-on:click="logout()"
      >Wyloguj</router-link
    >
  </nav>
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      token: String,
    };
  },
  mounted() {
    this.token = localStorage.getItem("token");
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.token = "";
    },
  },
};
</script>

<style lang="scss">
body,
html {
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <span v-if="!this.$store.state.token">
      <router-link to="/login">Logowanie</router-link> |
      <router-link to="/register">Rejestracja</router-link>
    </span>
    <span v-if="this.$store.state.token !== ''">
      <router-link to="/recipes/addRecipe">Dodaj Przepis</router-link> |
      <router-link to="/recipes/myRecipes">Moje przepisy</router-link> |
      <router-link to="/recipes/favouriteRecipes">
        Ulubione przepisy
      </router-link>
      &nbsp;|
      <router-link to="/" v-on:click="logout()">Wyloguj</router-link>
    </span>
  </nav>
  <router-view />
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.state.token = "";
      sessionStorage.clear();
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

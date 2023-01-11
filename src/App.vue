<template>
  <v-app>
    <v-main>
      <div class="navbar">
        <nav>
          <div class="navbar-left">
            <div class="navbar-item">
              <router-link to="/">Home</router-link>
            </div>
            <div class="navbar-item">
              <router-link to="/about">About</router-link>
            </div>
          </div>
          <div class="dropdown-div navbar-item">
            <div class="aselect">
              <div class="selector" @mouseenter="show()" @mouseleave="hide()">
                <div class="label"><i class="fas fa-user"></i></div>
                <div
                  :class="{ hidden: !visible, visible }"
                  class="dropdown-list"
                >
                  <span v-if="!this.$store.state.token" class="navbar-span">
                    <div class="navbar-item">
                      <router-link to="/login">Logowanie</router-link>
                    </div>
                    <div class="navbar-item">
                      <router-link to="/register">Rejestracja</router-link>
                    </div>
                  </span>
                  <span v-if="this.$store.state.token" class="navbar-span">
                    <div class="navbar-item">
                      <router-link to="/recipes/addRecipe"
                        >Dodaj Przepis</router-link
                      >
                    </div>
                    <div class="navbar-item">
                      <router-link to="/recipes/myRecipes"
                        >Moje przepisy</router-link
                      >
                    </div>
                    <div class="navbar-item">
                      <router-link to="/recipes/favouriteRecipes">
                        Ulubione przepisy
                      </router-link>
                    </div>
                    <div class="navbar-item">
                      <router-link to="/" v-on:click="logout()"
                        >Wyloguj</router-link
                      >
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div class="container">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    visible: false,
  }),
  methods: {
    logout() {
      this.$store.state.token = "";
      sessionStorage.clear();
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
$navbar-background-color: #009100;
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
.container {
  display: flex;
  justify-content: center;
  height: 95%;
}
.navbar {
  width: 100%;
  height: 5%;
  background-color: $navbar-background-color;
  display: flex;
  nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .navbar-left {
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .navbar-item {
      width: 10%;
    }
  }
  .dropdown-div {
    width: 10%;
    height: 100%;
    color: #fff;
  }
  .dropdown-div-click {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.navbar-item {
  background-color: $navbar-background-color;
  display: block;
  min-width: 130px;
  a {
    display: flex;
    font-weight: bolder;
    font-size: 1.2em;
    text-decoration: none;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #fff;
    &.router-link-exact-active {
      background-color: #00ff00;
      text-shadow: 0.6px 0.6px 0 #000, 0.6px 0.6px 0 #000, -0.6px 0.6px 0 #000,
        0.6px 0.6px 0 #000;
    }
  }
}
.navbar-item:hover {
  background-color: #00ff00;
}
.navbar-span {
  .navbar-item {
    color: red;
  }
}
.hidden {
  visibility: hidden;
}
.visible {
  visibility: visible;
}
.aselect {
  width: 100%;
  height: 100%;
  display: block;
  .selector {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    .label {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.2em;
      width: 100%;
      height: 100%;
    }
    .dropdown-list {
      width: 150%;
      position: absolute;
      right: 0;
    }
  }
  a {
    display: block;
    width: 100%;
    height: 100%;
    text-align: left;
    padding-left: 5%;
  }
}
</style>

<template>
  <v-app>
    <v-main>
      <div class="navbar" v-if="!isMobile">
        <nav>
          <div class="navbar-left">
            <div class="navbar-item">
              <router-link to="/">Przepisowo</router-link>
            </div>
            <div class="dropdown-div navbar-item">
              <div class="categorylist-dropdown">
                <div
                  class="selector"
                  @mouseenter="showCategories"
                  @mouseleave="hideCategories"
                >
                  <div class="label">Kategorie</div>
                  <div
                    :class="{ hidden: !cvisible, cvisible }"
                    class="dropdown-list"
                  >
                    <div
                      class="category-item"
                      v-for="(item, i) in categories"
                      :key="i"
                      @click="redirectToCategoryPage(item.categoryId)"
                    >
                      {{ capitalized(item.name) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="navbar-item">
              <router-link to="/recipes/ranking">Ranking</router-link>
            </div>
            <div class="navbar-search">
              <input
                placeholder="Wyszukaj przepis po nazwie"
                v-model="searchRecipe"
                class="search-field"
                @keyup.enter="searchForRecipe"
              />
              <button class="search-button" @click="searchForRecipe">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div class="navbar-right">
            <div class="navbar-item">
              <router-link to="/recipes/findRecipe">
                <i class="fa-solid fa-utensils"></i>
              </router-link>
            </div>
            <div class="dropdown-div navbar-item">
              <div class="shoppinglist-dropdown">
                <div
                  class="selector"
                  @mouseenter="showShopping"
                  @mouseleave="hideShopping"
                  id="print"
                >
                  <div class="label">
                    <i class="fa-solid fa-cart-plus"></i>
                  </div>
                  <div
                    :class="{ hidden: !svisible, svisible }"
                    class="dropdown-list"
                  >
                    <div class="shopping-header">
                      <span>Lista zakupów</span>
                      <div>
                        <i
                          class="fas fa-print shopping-list-icon"
                          @click="printShoppingList"
                          v-if="!isShoppingListEmpty"
                        ></i>
                        &nbsp;
                        <i
                          class="fas fa-times shopping-list-icon"
                          @click="resetShoppingList"
                        ></i>
                      </div>
                    </div>
                    <div
                      v-if="this.$store.state.shoppingList.length == 0"
                      class="shopping-item"
                    >
                      Twoja lista zakupów jest pusta
                    </div>
                    <div
                      class="shopping-item"
                      v-for="(item, i) in this.$store.state.shoppingList"
                      :key="i"
                    >
                      <div>
                        <i
                          class="fas fa-times shopping-list-icon"
                          @click="removeFromShoppingList(i)"
                        ></i>
                        {{ item.amount + " " + item.unit + " " + item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="dropdown-div navbar-item">
              <div class="user-dropdown">
                <div class="selector" @mouseenter="show" @mouseleave="hide">
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
                          >Dodaj przepis</router-link
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
                      <div class="navbar-item" v-if="admin">
                        <router-link to="/recipes/adminPanel">
                          Admin panel
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
          </div>
        </nav>
      </div>
      <div class="navbar navbar-mobile" v-if="isMobile">
        <nav>
          <div class="navbar-first-row">
            <div class="navbar-left">
              <div class="navbar-item">
                <router-link to="/">Przepisowo</router-link>
              </div>
              <div class="dropdown-div navbar-item">
                <div class="categorylist-dropdown">
                  <div
                    class="selector"
                    @mouseleave="hideCategories"
                    @click="toggleCategories"
                  >
                    <div class="label">Kategorie</div>
                    <div
                      :class="{ hidden: !cvisible, cvisible }"
                      class="dropdown-list"
                    >
                      <div
                        class="category-item"
                        v-for="(item, i) in categories"
                        :key="i"
                        @click="redirectToCategoryPage(item.categoryId)"
                      >
                        {{ capitalized(item.name) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="navbar-item">
                <router-link to="/recipes/ranking">Ranking</router-link>
              </div>
            </div>
            <div class="navbar-right">
              <div class="navbar-item">
                <router-link to="/recipes/findRecipe">
                  <i class="fa-solid fa-utensils"></i>
                </router-link>
              </div>
              <div class="dropdown-div navbar-item">
                <div class="shoppinglist-dropdown">
                  <div
                    class="selector"
                    @mouseleave="hideShopping"
                    @click="toggleShopping"
                    id="print"
                  >
                    <div class="label">
                      <i class="fa-solid fa-cart-plus"></i>
                    </div>
                    <div
                      :class="{ hidden: !svisible, svisible }"
                      class="dropdown-list"
                    >
                      <div class="shopping-header">
                        <span>Lista zakupów</span>
                        <div>
                          <i
                            class="fas fa-print shopping-list-icon"
                            @click="printShoppingList"
                            v-if="!isShoppingListEmpty"
                          ></i>
                          &nbsp;
                          <i
                            class="fas fa-times shopping-list-icon"
                            @click="resetShoppingList"
                          ></i>
                        </div>
                      </div>
                      <div
                        v-if="this.$store.state.shoppingList.length == 0"
                        class="shopping-item"
                      >
                        Twoja lista zakupów jest pusta
                      </div>
                      <div
                        class="shopping-item"
                        v-for="(item, i) in this.$store.state.shoppingList"
                        :key="i"
                      >
                        <div>
                          <i
                            class="fas fa-times shopping-list-icon"
                            @click="removeFromShoppingList(i)"
                          ></i>
                          {{ item.amount + " " + item.unit + " " + item.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dropdown-div navbar-item">
                <div class="user-dropdown">
                  <div class="selector" @mouseleave="hide" @click="toggle">
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
                            >Dodaj przepis</router-link
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
                        <div class="navbar-item" v-if="admin">
                          <router-link to="/recipes/adminPanel">
                            Admin panel
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
            </div>
          </div>
          <div class="navbar-second-row">
            <div class="navbar-search">
              <input
                placeholder="Wyszukaj przepis po nazwie"
                v-model="searchRecipe"
                class="search-field"
                @keyup.enter="searchForRecipe"
              />
              <button class="search-button" @click="searchForRecipe">
                <i class="fas fa-search"></i>
              </button>
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
import router from "@/router";
import axios from "axios";

export default {
  name: "App",

  data: () => ({
    admin: false,
    visible: false,
    svisible: false,
    cvisible: false,
    searchRecipe: "",
    categories: [],
    windowWidth: 0,
    isMobile: false,
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
    toggle() {
      this.visible = !this.visible;
    },
    showShopping() {
      this.svisible = true;
    },
    hideShopping() {
      this.svisible = false;
    },
    toggleShopping() {
      this.svisible = !this.svisible;
    },
    showCategories() {
      this.cvisible = true;
    },
    hideCategories() {
      this.cvisible = false;
    },
    toggleCategories() {
      this.cvisible = !this.cvisible;
    },
    resetShoppingList() {
      this.$store.commit("clearShoppingList");
    },
    removeFromShoppingList(index) {
      this.$store.commit("removeFromShoppingList", index);
    },
    printShoppingList() {
      let stylesHtml = "";
      const prtHtml = document.getElementById("print").innerHTML;
      const WinPrint = window.open(
        "",
        "xd",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0 popup"
      );
      WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
            ${stylesHtml}
            <title>Lista zakupów</title>
          </head>
          <body>
            ${prtHtml}
          </body>
        </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      window.setTimeout(() => {
        WinPrint.close();
      }, 100);
    },
    searchForRecipe() {
      router.push({ path: "/", query: { search: this.searchRecipe } });
      this.searchRecipe = "";
    },
    capitalized(text) {
      const firstLetter = text[0].toUpperCase();
      const rest = text.slice(1);

      return firstLetter + rest;
    },
    redirectToCategoryPage(categoryId) {
      router.push({
        name: "RecipesByCategory",
        params: { id: categoryId },
      });
      this.hideCategories();
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
  async mounted() {
    await axios
      .get(
        process.env.VUE_APP_API_BASEURL + "recipes/categories/getAllCategories"
      )
      .then((response) => {
        this.categories = response.data.categories;
      })
      .catch((error) => {
        console.log(error);
      });
    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  computed: {
    isShoppingListEmpty() {
      return this.$store.state.shoppingList.length === 0;
    },
  },
  watch: {
    async $route() {
      if (sessionStorage.getItem("admin")) {
        this.admin = sessionStorage.getItem("admin");
      } else {
        this.admin = false;
      }
    },
    windowWidth(newValue) {
      if (newValue < 800) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
$navbar-background-color: #008500;
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
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  padding-top: 45px;
  @media (max-width: 800px) {
    padding-top: 80px;
  }
}
.navbar-mobile {
  min-height: 80px;
  nav {
    display: flex;
    flex-wrap: wrap;
    .navbar-first-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      height: 50%;
      .navbar-item {
        width: 25%;
      }
      .navbar-right {
        .user-dropdown {
          .selector {
            .dropdown-list {
              .navbar-span {
                .navbar-item {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
    .navbar-second-row {
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .navbar-search {
        width: 80%;
      }
    }
  }
}
.navbar {
  width: 100%;
  height: 5%;
  background-color: $navbar-background-color;
  display: flex;
  position: fixed;
  z-index: 1;
  nav {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }
  .navbar-left {
    width: 85%;
    @media (max-width: 500px) {
      width: 80%;
    }
    height: 100%;
    display: flex;
    flex-direction: row;
    .navbar-item {
      width: 10%;
      @media (max-width: 500px) {
        width: auto;
        min-width: 50px;
      }
    }
  }
  .dropdown-div {
    width: 5%;
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
  min-width: 80px;
  @media (max-width: 500px) {
    min-width: 30px;
  }
  a {
    display: flex;
    font-weight: bolder;
    @media (max-width: 500px) {
      font-size: 3vw;
    }
    font-size: 1.2vw;
    text-decoration: none;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #fff;
    &.router-link-exact-active {
      background-color: #0fb400;
    }
  }
}
.navbar-item:hover {
  background-color: #0fb400;
}
.navbar-span {
  .navbar-item {
    color: red;
  }
}
.navbar-search {
  display: flex;
  flex-direction: row;
  width: 40%;
  @media (max-width: 500px) {
    width: 50%;
  }
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-left: 2%;
  padding-right: 2%;
  .search-field {
    background-color: white;
    width: 90%;
    height: 60%;
    padding-left: 10px;
    font-size: 0.9vw;
    @media (max-width: 500px) {
      font-size: 2.5vw;
    }
  }
  .search-field:focus {
    outline: none;
  }
  .search-button {
    width: 10%;
    height: 60%;
    background-color: #026002;
    color: white;
  }
  .search-button:hover {
    background-color: #047204;
    color: white;
  }
}
.navbar-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 15%;
  @media (max-width: 500px) {
    width: 20%;
  }
}
.hidden {
  visibility: hidden;
}
.visible {
  visibility: visible;
}
.categorylist-dropdown {
  width: 100%;
  height: 100%;
  display: block;
  cursor: pointer;
  .selector {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    .label {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bolder;
      @media (max-width: 500px) {
        font-size: 3vw;
      }
      font-size: 1.1vw;
      width: 100%;
      height: 100%;
    }
    .dropdown-list {
      width: 10vw;
      @media (max-width: 500px) {
        min-width: 150px;
      }
      min-width: 170px;
      position: absolute;
      left: 0;
      .category-item {
        background-color: $navbar_background-color;
        font-size: 1.05vw;
        @media (max-width: 500px) {
          font-size: 4vw;
        }
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 3px;
        padding-botton: 3px;
      }
      .category-item:hover {
        background-color: #0fb400;
      }
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
.user-dropdown {
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
      @media (max-width: 500px) {
        font-size: 3vw;
      }
      font-size: 1.2vw;
      width: 100%;
      height: 100%;
    }
    .dropdown-list {
      @media (max-width: 500px) {
        min-width: 150px;
      }
      min-width: 200px;
      position: absolute;
      right: 0;
      .navbar-span {
        .navbar-item {
          a {
            font-size: 1.1vw;
            @media (max-width: 500px) {
              font-size: 4vw;
            }
          }
        }
      }
    }
  }
  a {
    display: block;
    width: 100%;
    height: 100%;
    text-align: left;
    padding-left: 5%;
    padding-right: 5%;
  }
}
.shoppinglist-dropdown:hover,
.user-dropdown:hover {
  cursor: pointer;
}
.shoppinglist-dropdown {
  width: 100%;
  height: 100%;
  display: block;
  .selector {
    z-index: 1;
    width: 100%;
    height: 100%;
    position: relative;
    .label {
      display: flex;
      justify-content: center;
      align-items: center;
      @media (max-width: 500px) {
        font-size: 3vw;
      }
      font-size: 1.2vw;
      width: 100%;
      height: 100%;
    }
    .dropdown-list {
      width: 300%;
      min-width: 200px;
      position: absolute;
      right: 0;
      background-color: #fff;
      color: #000;
      padding-left: 10%;
      padding-right: 10%;
      border-left: 2px solid green;
      border-right: 2px solid green;
      .shopping-header {
        font-size: 1.2vw;
        @media (max-width: 500px) {
          font-size: 4vw;
        }
        font-weight: bold;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2px solid green;
      }
      .shopping-item {
        width: 100%;
        border-bottom: 1px solid green;
        padding-top: 2%;
        padding-bottom: 2%;
        div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 0.9vw;
          @media (max-width: 1000px) {
            font-size: 1vw;
          }
          @media (max-width: 500px) {
            font-size: 2.5vw;
          }
          gap: 5%;
          width: 100%;
        }
      }
    }
  }
}
.shopping-list-icon:hover {
  color: green;
  cursor: pointer;
}
</style>

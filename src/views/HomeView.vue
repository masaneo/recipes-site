<template>
  <div class="recipes-container">
    <div class="recipes">
      <div class="header" v-if="!isSearching">
        Przepisy kulinarne naszych użytkowników
      </div>
      <div class="header" v-if="isSearching">
        Wyszukujesz:
        <span class="search-text">{{
          this.router.currentRoute.value.query.search
        }}</span>
      </div>
      <SingleRecipe
        v-for="item in recipes.data"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
      />
      <div class="recipes-not-found" v-if="recipes.total === 0">
        <div class="details">Nie znaleziono żadnych przepisów</div>
        <div class="latest-container" v-if="isSearching">
          <div class="latest-recipes-header">
            Może zainteresuje Cie jeden z najnowszych przepisów
          </div>
          <div class="latest-recipes">
            <SingleRecipe
              v-for="item in newRecipes"
              :key="item.recipeId"
              :recipeName="item.name"
              :recipeId="item.recipeId"
            />
          </div>
        </div>
      </div>
    </div>
    <vue-awesome-paginate
      :total-items="recipes.total"
      :items-per-page="recipes.per_page"
      :max-pages-shown="5"
      :on-click="changePageHandler"
      v-model="curPage"
      v-if="recipes.total > recipes.per_page"
      class="paginate-bar"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import router from "@/router";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    SingleRecipe,
  },
  data() {
    return {
      page: "",
      curPage: 1,
      searchText: "",
      recipes: "",
      newRecipes: "",
      links: [],
    };
  },
  methods: {
    changePageHandler(page) {
      if (router.currentRoute.value.query.search) {
        router.push({
          query: { search: router.currentRoute.value.query.search, page: page },
        });
      } else {
        router.push({ query: { page: page } });
      }
      this.getRecipesData(page);
      this.curPage = page;
    },
    getRecipesData(page) {
      axios
        .get(this.links[page].url, {
          params: { searchString: this.searchText },
        })
        .then((response) => {
          this.recipes = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllRecipes(page) {
      await axios
        .get(
          process.env.VUE_APP_API_BASEURL + "recipes/getAllRecipes?page=" + page
        )
        .then((response) => {
          this.recipes = response.data;
          this.links = response.data.links;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getRecipesSearch(searchText) {
      await axios
        .get(process.env.VUE_APP_API_BASEURL + "recipes/searchRecipes", {
          params: { searchString: searchText },
        })
        .then((response) => {
          this.recipes = response.data;
          this.links = response.data.links;
          this.curPage = 1;
          if (response.data.total === 0) {
            this.getNewestRecipes();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getNewestRecipes() {
      await axios
        .get(process.env.VUE_APP_API_BASEURL + "recipes/getNewestRecipes")
        .then((response) => {
          this.newRecipes = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    this.curPage = router.currentRoute.value.query.page
      ? parseInt(router.currentRoute.value.query.page)
      : 1;
    if (!this.isSearching) {
      this.getAllRecipes(this.curPage);
    } else if (this.isSearching) {
      this.getRecipesSearch(router.currentRoute.value.query.search);
    }
  },
  watch: {
    async $route() {
      this.searchText = this.router.currentRoute.value.query.search;
      if (!this.searchText) {
        this.getAllRecipes(this.curPage);
      } else if (
        this.searchText &&
        !this.router.currentRoute.value.query.page
      ) {
        this.getRecipesSearch(this.searchText);
      } else if (this.searchText && this.router.currentRoute.value.query.page) {
        this.getRecipesData(this.curPage);
      }
      if (!this.searchText && !this.router.currentRoute.value.query.page) {
        this.curPage = 1;
        this.getRecipesData(1);
      }
    },
  },
  computed: {
    isSearching() {
      return this.router.currentRoute.value.query.search ? true : false;
    },
  },
};
</script>

<script setup>
import { VueAwesomePaginate } from "vue-awesome-paginate";
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>
<style lang="scss">
@import "@/assets/styles/pagination-bar.sass";
</style>

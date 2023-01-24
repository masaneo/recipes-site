<template>
  <div class="recipes-container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in recipes.data"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
      />
    </div>
    <vue-awesome-paginate
      :total-items="recipes.total"
      :items-per-page="recipes.per_page"
      :max-pages-shown="5"
      :on-click="changePageHandler"
      v-model="curPage"
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
      console.log("page change");
    },
    getRecipesData(page) {
      axios
        .get(this.links[page].url, {
          params: { searchString: this.searchText },
        })
        .then((response) => {
          this.recipes = response.data;
          console.log(this.recipes);
          console.log("dupa");
          console.log(page);
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
          console.log(this.recipes);
          console.log("testing");
          console.log(response);
          console.log(this.links);
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
    this.getAllRecipes(this.curPage);
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
        await axios
          .get(process.env.VUE_APP_API_BASEURL + "recipes/searchRecipes", {
            params: { searchString: this.searchText },
          })
          .then((response) => {
            this.recipes = response.data;
            this.links = response.data.links;
            this.curPage = 1;
            console.log("xd");
            console.log(this.recipes);
            console.log(this.links);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (this.searchText && this.router.currentRoute.value.query.page) {
        this.getRecipesData(this.curPage);
      }
      if (!this.searchText && !this.router.currentRoute.value.query.page) {
        this.curPage = 1;
        this.getRecipesData(1);
      }
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

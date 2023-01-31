<template>
  <div class="recipes-container" v-if="this.ready">
    <div class="recipes">
      <div class="header">Przepisy z kategorii: {{ this.categoryName }}</div>
      <div class="header" v-if="this.recipes.data.length === 0">
        Nie znaleziono przepisów z tej kategorii
      </div>
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
      v-if="recipes.total > recipes.per_page"
      class="paginate-bar"
    />
  </div>
</template>
<script>
import router from "@/router";
import axios from "axios";
import SingleRecipe from "@/components/SingleRecipe";
import { VueAwesomePaginate } from "vue-awesome-paginate";

export default {
  components: { SingleRecipe, VueAwesomePaginate },
  data() {
    return {
      ready: false,
      recipes: [],
      categoryName: "",
      categoryId: 0,
      curPage: 1,
      links: [],
    };
  },
  methods: {
    async getRecipesByCategory(categoryId) {
      await axios
        .get(process.env.VUE_APP_API_BASEURL + "recipes/getRecipesByCategory", {
          params: { categoryId: categoryId, page: this.curPage },
        })
        .then((response) => {
          this.ready = true;
          this.recipes = response.data.recipes;
          this.categoryName = response.data.categoryName[0];
          this.links = response.data.recipes.links;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changePageHandler(page) {
      router.push({ query: { page: page } });
      this.getRecipesData(page);
      this.curPage = page;
    },
    getRecipesData(page) {
      axios
        .get(this.links[page].url, {
          params: {
            token: this.$store.state.token,
            categoryId: this.categoryId,
          },
        })
        .then((response) => {
          this.recipes = response.data.recipes;
          this.links = response.data.recipes.links;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    this.categoryId = router.currentRoute.value.params.id;
    await this.getRecipesByCategory(this.categoryId);
    this.curPage = router.currentRoute.value.query.page
      ? parseInt(router.currentRoute.value.query.page)
      : 1;
  },
  watch: {
    async $route() {
      this.categoryId = router.currentRoute.value.params.id;
      if (!router.currentRoute.value.query.page) {
        await this.getRecipesByCategory(this.categoryId);
      }
    },
  },
};
</script>
<style scoped lang="sass">
@import "@/assets/styles/home-view.sass"
</style>

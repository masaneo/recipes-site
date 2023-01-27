<template>
  <div class="recipes-container">
    <div class="recipes" v-if="ready">
      <SingleRecipe
        v-for="item in recipes.data"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
        :favourite="true"
      />
      <div class="header" v-if="recipes.data.length === 0">
        Brak ulubionych przepisów
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
import { VueAwesomePaginate } from "vue-awesome-paginate";
import axios from "axios";
import router from "@/router";

export default {
  name: "FavouriteRecipesView",
  components: {
    SingleRecipe,
    VueAwesomePaginate,
  },
  data: function () {
    return {
      ready: false,
      recipes: [],
      curPage: 1,
      links: [],
    };
  },
  methods: {
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
          this.ready = true;
          this.recipes = response.data;
          this.links = response.data.links;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    await axios
      .get(process.env.VUE_APP_API_BASEURL + "recipes/getFavouriteRecipes", {
        params: {
          token: this.$store.state.token,
        },
      })
      .then((res) => {
        this.ready = true;
        this.recipes = res.data;
        this.links = res.data.links;
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

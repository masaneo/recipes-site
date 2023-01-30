<template>
  <div class="recipes-container">
    <div class="recipes" v-if="ready">
      <div class="header">Ostatnio modyfikowane przepisy</div>
      <div class="header" v-if="recipes.data.length === 0">
        Nie znaleziono przepisów w bazie
      </div>
      <SingleRecipe
        v-for="item in recipes.data"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
        :admin="true"
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
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import { VueAwesomePaginate } from "vue-awesome-paginate";
import axios from "axios";
import router from "@/router";

export default {
  name: "AdminPanelView",
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
    async getRecipesData(page) {
      await axios
        .get(this.links[page].url, {
          params: {
            token: this.$store.state.token,
          },
        })
        .then((response) => {
          this.ready = true;
          this.recipes = response.data.recipes;
          this.links = response.data.recipes.links;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    if (!this.$store.state.token) {
      await router.push("/");
    }
    this.curPage = router.currentRoute.value.query.page
      ? parseInt(router.currentRoute.value.query.page)
      : 1;
    await axios
      .get(process.env.VUE_APP_API_BASEURL + "recipes/admin/getAllRecipes", {
        params: {
          token: this.$store.state.token,
          page: this.curPage,
        },
      })
      .then((res) => {
        this.ready = true;
        if (res.data.isAdmin !== true) {
          this.ready = false;
          router.push("/");
        }
        this.recipes = res.data.recipes;
        this.links = res.data.recipes.links;
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

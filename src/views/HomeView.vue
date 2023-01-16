<template>
  <div class="recipes-container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in res.data"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
      />
    </div>
    <vue-awesome-paginate
      v-model="curPage"
      :total-items="res.total"
      :items-per-page="res.per_page"
      :max-pages-shown="5"
      :on-click="changePageHandler"
      :current-page="curPage"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import router from "@/router";

export default {
  name: "HomeView",
  components: {
    SingleRecipe,
  },
  data() {
    return {
      curPage: this.currentPage,
    };
  },
  methods: {},
};
</script>

<script setup>
import { onBeforeMount, ref } from "vue";
import { VueAwesomePaginate } from "vue-awesome-paginate";
import axios from "axios";

let currentPage = router.currentRoute.value.query.page
  ? parseInt(router.currentRoute.value.query.page)
  : 1;
const res = ref([]);

onBeforeMount(async () => {
  res.value = await fetch(
    "http://localhost:8000/api/recipes/getAllRecipes?page=" + currentPage
  ).then((raw) => raw.json());
});

const changePageHandler = async (page) => {
  router.push({ query: { page: page } });
  currentPage = page;
  getRecipesData(currentPage);
};

const getRecipesData = async (page) => {
  axios
    .get("http://localhost:8000/api/recipes/getAllRecipes?page=" + page)
    .then((response) => {
      res.value = response.data;
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>
<style lang="scss">
@import "@/assets/styles/pagination-bar.sass";
</style>

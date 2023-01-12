<template>
  <div class="container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in res"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
      />
      <pagination-bar
        :pages="10"
        :current-page="this.curPage"
        :visible-pages="5"
        @pagechanged="onPageChange"
      ></pagination-bar>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import PaginationBar from "@/components/PaginationBar";

export default {
  name: "HomeView",
  components: {
    SingleRecipe,
    PaginationBar,
  },
  data() {
    return {
      curPage: 1,
    };
  },
  methods: {
    onPageChange(page) {
      console.log(page);
      console.log("click");
      this.curPage = page;
    },
  },
};
</script>

<script setup>
import { onBeforeMount, ref } from "vue";

const res = ref([]);

onBeforeMount(async () => {
  res.value = await fetch(
    "http://localhost:8000/api/recipes/getAllRecipes"
  ).then((raw) => raw.json());
});
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

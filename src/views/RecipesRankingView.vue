<template>
  <div class="ranking-container">
    <div class="ranking-header">
      <h1>Najlepiej oceniane w tym miesiącu</h1>
    </div>
    <div
      v-for="(recipe, index) in this.recipes"
      :key="index"
      class="ranking-item"
      @click="showRecipe(recipe.recipeId)"
    >
      <div class="ranking-item-header">
        {{ index + 1 + ". " + capitalized(recipe.name) }}
      </div>
      <div class="ranking-item-img">
        <img :src="recipe.img" alt="recipe img" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "RecipesRankingView",
  data() {
    return {
      recipes: Object,
    };
  },
  methods: {
    capitalized(text) {
      const firstLetter = text[0].toUpperCase();
      const rest = text.slice(1);

      return firstLetter + rest;
    },
    showRecipe(id) {
      router.push({ name: "SingleRecipe", params: { id: id } });
    },
  },
  mounted() {
    axios
      .get("http://localhost:8000/api/recipes/votes/highestVoted")
      .then((response) => {
        this.recipes = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped lang="sass">
@import "@/assets/styles/recipes-ranking-view.sass"
</style>

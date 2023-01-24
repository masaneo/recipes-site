<template>
  <div class="content-container">
    <div class="search-section">
      <h1>Wymień po przecinku wszystkie dostępne składniki</h1>
      <div class="search-row">
        <input
          type="text"
          placeholder="Wymień je tutaj"
          v-model="ingredientString"
          @keyup.enter="sendIngredients"
        />
        <button type="button" @click="sendIngredients">Prześlij</button>
      </div>
    </div>
    <div class="recipes-section" v-if="ready">
      <SingleRecipe
        v-for="recipe in recipes"
        :key="recipe.recipeId"
        :recipe-name="recipe.name"
        :recipe-id="recipe.recipeId"
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import SingleRecipe from "@/components/SingleRecipe";

export default {
  components: { SingleRecipe },
  props: {},
  data() {
    return {
      ready: false,
      ingredientString: "",
      recipes: [],
    };
  },
  mounted() {},
  methods: {
    sendIngredients() {
      axios
        .get(process.env.VUE_APP_API_BASEURL + "recipes/findRecipes", {
          params: {
            ingredientList: this.ingredientString,
          },
        })
        .then((response) => {
          this.recipes = response.data;
          this.ready = true;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/find-recipe-view.sass";
</style>

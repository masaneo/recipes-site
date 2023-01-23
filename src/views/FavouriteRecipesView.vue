<template>
  <div class="recipes-container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in recipes"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
        :favourite="true"
      />
      <div v-if="recipes.length === 0">
        <h1>Brak ulubionych przepisów</h1>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import axios from "axios";

export default {
  name: "FavouriteRecipesView",
  components: {
    SingleRecipe,
  },
  data: function () {
    return {
      recipes: "",
    };
  },
  async mounted() {
    await axios
      .get(process.env.VUE_APP_API_BASEURL + "recipes/getFavouriteRecipes", {
        params: {
          token: this.$store.state.token,
        },
      })
      .then((res) => {
        this.recipes = res.data;
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

<template>
  <div class="container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in recipes"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import axios from "axios";

export default {
  name: "UserRecipesView",
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
      .get("http://localhost:8000/api/recipes/getUserRecipes", {
        params: {
          token: this.$store.state.token,
        },
      })
      .then((res) => {
        this.recipes = res.data;
        console.log(this.recipes);
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

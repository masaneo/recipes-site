<template>
  <div class="recipes-container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in recipes"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
        :owner="true"
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
      .get(process.env.VUE_APP_API_BASEURL + "recipes/getUserRecipes", {
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

<template>
  <div class="recipe" v-on:click="showRecipe()">
    <div>
      <img width="150" height="100" :src="this.image" alt="Image Not Loaded" />
    </div>
    <div class="recipe-name">
      {{ capitalized(recipeName) }}
    </div>
  </div>
</template>

<script>
import router from "@/router";
import axios from "axios";

export default {
  props: {
    recipeName: String,
    recipeId: Number,
  },
  data() {
    return {
      image: "",
    };
  },
  mounted() {
    axios
      .get(
        process.env.VUE_APP_API_BASEURL +
          "recipes/getSingleRecipe/" +
          this.recipeId +
          "/getImage"
      )
      .then((response) => {
        this.image = response.data.image;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    showRecipe() {
      router.push({ name: "SingleRecipe", params: { id: this.recipeId } });
    },
    capitalized(text) {
      const firstLetter = text[0].toUpperCase();
      const rest = text.slice(1);

      return firstLetter + rest;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/recipe-box.sass";
</style>

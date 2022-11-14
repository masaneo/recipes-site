<template>
  <div class="recipe" v-on:click="showRecipe()">
    <div>
      <img width="150" height="100" :src="this.image" alt="Image Not Loaded" />
    </div>
    <div>
      <span>{{ recipeName }}</span>
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
        "http://localhost:8000/api/recipes/getSingleRecipe/" +
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
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/recipe-box.sass";
</style>

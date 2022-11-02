<template>
  <div class="recipe" v-on:click="showRecipe()">
    <span>{{ recipeName }}</span>
  </div>
</template>

<script>
import router from "@/router";

export default {
  props: {
    recipeName: String,
    recipeId: Number,
  },
  data() {
    return {};
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

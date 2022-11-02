<template>
  <div class="container">
    <div class="recipes">
      <SingleRecipe
        v-for="item in res"
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

export default {
  name: "HomeView",
  components: {
    SingleRecipe,
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

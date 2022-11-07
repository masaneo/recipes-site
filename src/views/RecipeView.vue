<template>
  <div v-if="dataReady" class="container">
    <div>{{ recipe.recipe.name }}</div>
    <div>
      <span>potrzebne składniki</span>
      <ul>
        <li v-for="item in recipe.ingredients" :key="item.ingredientId">
          {{ item.amount + " " + item.name }}
        </li>
      </ul>
    </div>
    <div>
      <span>Jak przygotować?</span>
      <CookingStep
        v-for="item in recipe.cookingSteps"
        :key="item.stepId"
        :step="item.step"
        :step-number="item.stepId"
      />
    </div>
  </div>
  <div v-if="!dataReady && isError">
    <h1>Błąd serwera, spróbuj ponownie później</h1>
  </div>
</template>

<script>
// @ is an alias to /src

import axios from "axios";
import CookingStep from "@/components/CookingStep";

export default {
  name: "RecipeView",
  components: { CookingStep },
  data() {
    return {
      recipe: Object,
      dataReady: false,
      isError: false,
    };
  },
  async mounted() {
    await axios
      .post("http://localhost:8000/api/recipes/getSingleRecipe", {
        id: this.$route.params.id,
      })
      .then((res) => {
        this.recipe = res.data;
        this.dataReady = true;
        console.log(res.data);
      })
      .catch((error) => {
        this.isError = true;
        console.log(error);
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

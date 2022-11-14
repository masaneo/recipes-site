<template>
  <div v-if="dataReady" class="container">
    <img width="300" height="200" :src="recipe.image" alt="NotFound" />
    <div>{{ recipe.recipe.name }}</div>
    <div>
      <star-rating
        v-model="rating"
        :rating="rating"
        :increment="0.5"
        :max-rating="5"
        :show-rating="false"
        @update:rating="updateRating"
      />
    </div>
    <div>
      <span>potrzebne składniki</span>
      <ul>
        <li v-for="item in recipe.ingredients" :key="item.ingredientId">
          {{ item.amount + " " + item.unit + " " + item.name }}
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
import StarRating from "vue-star-rating";

export default {
  name: "RecipeView",
  components: { CookingStep, StarRating },
  data() {
    return {
      recipe: Object,
      dataReady: false,
      isError: false,
      rating: 0,
    };
  },
  methods: {
    updateRating(rating) {
      this.rating = rating;
      this.giveVote();
    },
    giveVote() {
      axios
        .post("http://localhost:8000/api/recipes/votes/addVote", {
          vote: this.rating,
          token: this.$store.state.token,
          recipeId: this.$route.params.id,
        })
        .then((response) => {
          console.log(response);
          this.succeed = true;
        })
        .catch((error) => {
          console.log(error);
          this.succeed = false;
        });
    },
  },
  async mounted() {
    await axios
      .post("http://localhost:8000/api/recipes/getSingleRecipe", {
        id: this.$route.params.id,
      })
      .then((res) => {
        this.recipe = res.data;
        this.dataReady = true;
      })
      .catch((error) => {
        this.isError = true;
        console.log(error);
      });
    await axios
      .get(
        "http://localhost:8000/api/recipes/votes/getUserVote/" +
          this.$store.state.token +
          "/" +
          this.$route.params.id
      )
      .then((res) => {
        console.log(res);
        this.rating = res.data.vote;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

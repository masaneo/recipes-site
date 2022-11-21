<template>
  <div v-if="dataReady" class="container">
    <div class="content">
      <div class="title-row">
        <h1>{{ recipe.recipe.name }}</h1>
      </div>
      <div class="first-row">
        <img :src="recipe.image" alt="NotFound" />
        <div class="first-row-features">
          <div class="rating">
            <div>
              <span>Twoja ocena</span>
              <star-rating
                :rating="rating"
                :increment="0.5"
                :max-rating="5"
                :show-rating="false"
                @update:rating="updateRating"
              />
            </div>
            <div>
              <span id="avg-vote">Średnia ocena: {{ this.averageVote }}</span>
            </div>
            <input
              v-if="!favouriteState"
              type="button"
              @click="addToFavourite(this.$route.params.id)"
              value="Dodaj do ulubionych"
            />
            <input
              v-if="favouriteState"
              type="button"
              @click="removeFromFavourite(this.$route.params.id)"
              value="Usuń z ulubionych"
            />
          </div>
        </div>
      </div>
      <div class="second-row">
        <div class="ingredients">
          <span class="title-span">Potrzebne składniki</span>
          <ul>
            <li v-for="item in recipe.ingredients" :key="item.ingredientId">
              {{ item.amount + " " + item.unit + " " + item.name }}
            </li>
          </ul>
        </div>
        <div class="steps">
          <span class="title-span">Jak przygotować?</span>
          <br />
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
    </div>
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
      lastPath: "",
      favouriteState: false,
      averageVote: 0,
    };
  },
  methods: {
    updateRating(rating) {
      this.rating = rating;
      this.giveVote();
    },
    giveVote() {
      if (this.$store.state.token) {
        axios
          .post("http://localhost:8000/api/recipes/votes/addVote", {
            vote: this.rating,
            token: this.$store.state.token,
            recipeId: this.$route.params.id,
          })
          .then((response) => {
            if (response) {
              alert("Pomyślnie oddano głos!");
              this.getAverageVote();
              this.succeed = true;
            }
          })
          .catch((error) => {
            console.log(error);
            this.succeed = false;
          });
      } else {
        alert("Musisz się zalogować żeby oddać głos!");
        this.rating = 0;
      }
    },
    addToFavourite(id) {
      if (this.$store.state.token) {
        axios
          .post("http://localhost:8000/api/recipes/addToFavourite", {
            token: this.$store.state.token,
            recipeId: id,
          })
          .then((response) => {
            this.favouriteState = true;
            console.log(response.data.message);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("Musisz się zalogować żeby dodać przepis do ulubionych!");
      }
    },
    removeFromFavourite(id) {
      axios
        .delete("http://localhost:8000/api/recipes/removeFromFavourite", {
          data: {
            token: this.$store.state.token,
            recipeId: id,
          },
        })
        .then((response) => {
          this.favouriteState = false;
          console.log(response.data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAverageVote() {
      axios
        .get("http://localhost:8000/api/recipes/votes/getAverageVote", {
          params: {
            recipeId: this.$route.params.id,
          },
        })
        .then((res) => {
          this.dataReady = true;
          this.averageVote = res.data.averageVote;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    await axios
      .post("http://localhost:8000/api/recipes/getSingleRecipe", {
        id: this.$route.params.id,
        token: this.$store.state.token,
      })
      .then((res) => {
        this.recipe = res.data;
        this.favouriteState = res.data.favourite;
      })
      .catch((error) => {
        this.isError = true;
        console.log(error);
      });
    await axios
      .get("http://localhost:8000/api/recipes/votes/getUserVote", {
        params: {
          token: this.$store.state.token,
          recipeId: this.$route.params.id,
        },
      })
      .then((res) => {
        this.rating = res.data.vote;
      })
      .catch((error) => {
        console.log(error);
      });
    await this.getAverageVote();
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/recipe-view.sass";
</style>

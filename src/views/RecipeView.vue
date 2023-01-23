<template>
  <div v-if="dataReady" class="container-recipes rec-content-container">
    <div class="title-row">
      <h1>{{ capitalized(recipe.recipe.name) }}</h1>
    </div>
    <div class="content">
      <div class="first-column">
        <div class="img-div"><img :src="recipe.image" alt="NotFound" /></div>
        <div class="first-column-features">
          <div class="author-div">Autor: {{ recipe.author.username }}</div>
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
          </div>
          <div class="button-div">
            <v-btn
              v-if="!favouriteState"
              color="success"
              @click="addToFavourite(this.$route.params.id)"
              >Dodaj do ulubionych</v-btn
            >
            <v-btn
              v-if="favouriteState"
              color="error"
              @click="removeFromFavourite(this.$route.params.id)"
              >Usuń z ulubionych</v-btn
            >
          </div>
        </div>
      </div>
      <div class="second-column">
        <div class="ingredients">
          <span class="title-span">Potrzebne składniki</span>
          <div class="ingredient-list">
            <div
              class="ingredient-row"
              v-for="item in recipe.ingredients"
              :key="item.ingredientId"
            >
              <div class="icon-div" @click="addToShoppingList(item)">
                <i class="fa-regular fa-pen-to-square"></i>
              </div>
              <div class="ingredient-div">
                {{ item.amount + " " + item.unit + " " + item.name }}
              </div>
            </div>
            <div class="ingredient-row">
              <v-btn @click="addAllToShoppingList()"
                >Dodaj wszystko do listy zakupów</v-btn
              >
            </div>
          </div>
        </div>
        <div class="steps">
          <span class="title-span">Jak przygotować?</span>
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
          .post(process.env.VUE_APP_API_BASEURL + "recipes/votes/addVote", {
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
          .post(process.env.VUE_APP_API_BASEURL + "recipes/addToFavourite", {
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
        .delete(
          process.env.VUE_APP_API_BASEURL + "recipes/removeFromFavourite",
          {
            data: {
              token: this.$store.state.token,
              recipeId: id,
            },
          }
        )
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
        .get(process.env.VUE_APP_API_BASEURL + "recipes/votes/getAverageVote", {
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
    capitalized(text) {
      const firstLetter = text[0].toUpperCase();
      const rest = text.slice(1);

      return firstLetter + rest;
    },
    addToShoppingList(it) {
      const newItem = {
        ingredientId: it.ingredientId,
        name: it.name,
        unit: it.unit,
        amount: it.amount,
      };
      this.$store.commit("addToShoppingList", newItem);
    },
    addAllToShoppingList() {
      this.recipe.ingredients.forEach((item) => {
        this.addToShoppingList(item);
      });
    },
  },
  computed: {},
  async mounted() {
    await axios
      .post(process.env.VUE_APP_API_BASEURL + "recipes/getSingleRecipe", {
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
      .get(process.env.VUE_APP_API_BASEURL + "recipes/votes/getUserVote", {
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
.container-recipes {
  background-image: url("~@/assets/images/bg-board.jpg");
}
</style>

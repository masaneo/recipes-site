<template>
  <div v-if="dataReady" class="container-recipes rec-content-container">
    <div class="title-row">
      <h1>{{ capitalized(recipe.recipe.name) }}</h1>
    </div>
    <dialog :open="dialog" class="reason-dialog">
      <div class="top-row">
        <p>Podaj sugerowane zmiany:</p>
        <i class="close-dialog" @click="toggleDialog">X</i>
      </div>
      <v-textarea
        class="suggested-changes"
        v-model="suggestedChanges"
        label="Sugerowane zmiany"
        hide-details="auto"
      ></v-textarea>
      <div class="bottom-row">
        <v-btn class="send-button" color="success" @click="sendChangeSuggestion"
          >Wyślij sugestie</v-btn
        >
      </div>
    </dialog>
    <dialog :open="showRecipeDialog" class="reason-dialog">
      <div class="top-row">
        <p>Podaj sugerowane zmiany:</p>
        <i class="close-dialog" @click="toggleHideRecipeDialog">X</i>
      </div>
      <v-textarea
        class="suggested-changes"
        v-model="majorSuggestedChanges"
        label="Sugerowane zmiany"
        hide-details="auto"
      ></v-textarea>
      <div class="bottom-row">
        <v-btn class="send-button" color="success" @click="hideRecipe"
          >Wyślij sugestie i ukryj przepis</v-btn
        >
      </div>
    </dialog>
    <div class="content">
      <div class="first-column">
        <div class="control-buttons" v-if="admin">
          <i
            class="fas fa-wrench control-button control-message"
            @click="toggleDialog"
          ></i>
          <i
            class="fa-regular fa-trash-can control-button control-delete"
            @click="toggleHideRecipeDialog"
          ></i>
          <i
            class="fa-solid fa-check control-accept control-button"
            @click="acceptChanges"
            v-if="isHidden"
          ></i>
        </div>
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
          <!--          <span class="info-span"-->
          <!--            >Aby dodać składnik do listy zakupów zaznacz go, a następnie-->
          <!--            naciśnij przycisk poniżej</span-->
          <!--          >-->
          <div class="ingredient-list">
            <div
              class="ingredient-row"
              v-for="item in recipe.ingredients"
              :key="item.ingredientId"
            >
              <!--              <div class="icon-div" @click="addToShoppingList(item)">-->
              <div class="icon-div">
                <!--                <i class="fa-solid fa-plus"></i>-->
                <input
                  type="checkbox"
                  :id="'ingredient' + item.ingredientId"
                  :value="item.ingredientId"
                  v-model="checkedIngredients"
                />
              </div>
              <div class="ingredient-div">
                <label :for="'ingredient' + item.ingredientId">
                  {{ item.amount + " " + item.unit + " " + item.name }}
                </label>
              </div>
            </div>
            <div class="ingredient-row">
              <v-btn @click="addCheckedToShoppingList()"
                >Dodaj zaznaczone do listy zakupów</v-btn
              >
            </div>
          </div>
        </div>
        <div class="steps">
          <span class="title-span">Jak przygotować?</span>
          <div class="step-list">
            <CookingStep
              v-for="item in recipe.cookingSteps"
              :key="item.stepId"
              :step="item.step"
              :step-number="item.stepId"
            />
          </div>
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
import router from "@/router";

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
      admin: false,
      dialog: false,
      showRecipeDialog: false,
      suggestedChanges: "",
      majorSuggestedChanges: "",
      isHidden: false,
      checkedIngredients: [],
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
          .then(() => {
            this.favouriteState = true;
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
        .then(() => {
          this.favouriteState = false;
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
    addToShoppingListById(id) {
      var ingredient = this.recipe.ingredients.find((item) => {
        return item.ingredientId === id;
      });

      this.addToShoppingList(ingredient);
    },
    addCheckedToShoppingList() {
      this.checkedIngredients.forEach((item) => {
        this.addToShoppingListById(item);
      });
      this.checkedIngredients = [];
    },
    addAllToShoppingList() {
      this.recipe.ingredients.forEach((item) => {
        this.addToShoppingList(item);
      });
    },
    hideRecipe() {
      if (confirm("Jesteś pewien że ukryć ten przepis?")) {
        axios
          .delete(
            process.env.VUE_APP_API_BASEURL +
              "recipes/admin/editRecipe/deleteRecipe",
            {
              data: {
                token: this.$store.state.token,
                suggestions: this.majorSuggestedChanges,
                recipeId: this.$route.params.id,
              },
            }
          )
          .then(() => {
            router.push({ name: "AdminPanelView" });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    toggleDialog() {
      this.dialog = !this.dialog;
    },
    toggleHideRecipeDialog() {
      this.showRecipeDialog = !this.showRecipeDialog;
    },
    sendChangeSuggestion() {
      axios
        .post(
          process.env.VUE_APP_API_BASEURL +
            "recipes/admin/editRecipe/sendChangeSuggestion",
          {
            recipeId: this.$route.params.id,
            suggestions: this.suggestedChanges,
            token: this.$store.state.token,
          }
        )
        .then(() => {
          this.dialog = false;
          this.suggestedChanges = "";
        });
    },
    acceptChanges() {
      axios
        .put(
          process.env.VUE_APP_API_BASEURL +
            "recipes/admin/editRecipe/acceptChanges",
          {
            recipeId: this.$route.params.id,
            token: this.$store.state.token,
          }
        )
        .then(() => {
          this.isHidden = !this.isHidden;
        });
    },
  },
  computed: {},
  async mounted() {
    if (sessionStorage.getItem("admin")) {
      this.admin = true;
    } else {
      this.admin = false;
    }
    await axios
      .post(process.env.VUE_APP_API_BASEURL + "recipes/getSingleRecipe", {
        id: this.$route.params.id,
        token: this.$store.state.token,
      })
      .then((res) => {
        this.recipe = res.data;
        this.isHidden = !res.data.recipe.is_visible;
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
  background-size: 100%;
}
</style>

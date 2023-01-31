<template>
  <div class="recipe">
    <div @click="showRecipe()">
      <img width="180" height="130" :src="this.image" alt="Image Not Loaded" />
    </div>
    <div
      class="recipe-name"
      v-if="!favourite && !owner && !admin"
      @click="showRecipe()"
    >
      {{ capitalized(recipeName) }}
    </div>
    <div v-if="favourite" class="favourite-recipe-name-row">
      <div class="recipe-name" @click="showRecipe()">
        {{ capitalized(recipeName) }}
      </div>
      <div
        class="add-ingredients-icon"
        @click="addIngredientsToShoppingList(recipeId)"
      >
        <i class="fas fa-pen-to-square"></i>
      </div>
    </div>
    <div v-if="owner" class="owner-recipe-name-row">
      <div class="recipe-name" @click="showRecipe()">
        {{ capitalized(recipeName) }}
      </div>
      <div class="edit-recipe-icon" @click="editRecipe(recipeId)">
        <i class="fas fa-wrench"></i>
      </div>
    </div>
    <div v-if="admin" class="admin-recipe-name-row">
      <div class="recipe-name" @click="showRecipe()">
        {{ capitalized(recipeName) }}
      </div>
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
    favourite: Boolean,
    owner: Boolean,
    admin: Boolean,
  },
  data() {
    return {
      image: "",
      ingredientList: [],
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
    addIngredientsToShoppingList(id) {
      axios
        .get(
          process.env.VUE_APP_API_BASEURL + "recipes/getIngredientsByRecipeId",
          {
            params: {
              recipeId: id,
            },
          }
        )
        .then((response) => {
          this.addAllToShoppingList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
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
    addAllToShoppingList(items) {
      items.forEach((item) => {
        this.addToShoppingList(item);
      });
    },
    editRecipe(id) {
      router.push({ name: "EditRecipe", params: { id: id } });
    },
    adminEditRecipe(id) {
      router.push({ name: "AdminModifyView", params: { id: id } });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/recipe-box.sass";
.recipe-name {
  font-size: 1.2vw;
  @media (max-width: 500px) {
    font-size: 4vw;
  }
}
</style>

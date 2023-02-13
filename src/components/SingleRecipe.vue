<template>
  <div class="recipe">
    <div @click="showRecipe()">
      <img :src="this.image" alt="Image Not Loaded" />
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
      <div class="add-ingredients-icon">
        <!--        <i class="fa-solid fa-cart-plus"></i>-->
        <input
          type="checkbox"
          id="recipeId"
          :value="recipeId"
          v-model="checkedRecipe"
          @click="selected"
        />
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
    checkedList: Array,
    favourite: Boolean,
    owner: Boolean,
    admin: Boolean,
  },
  data() {
    return {
      image: "",
      ingredientList: [],
      checkedRecipe: false,
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

    if (typeof this.checkedList !== undefined && this.checkedList) {
      if (this.checkedList.indexOf(this.recipeId.toString()) !== -1) {
        this.checkedRecipe = true;
      }
    }
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
    editRecipe(id) {
      router.push({ name: "EditRecipe", params: { id: id } });
    },
    selected(evt) {
      this.$emit("selected", {
        recipeId: evt.target.value,
        newSelection: evt.target.checked,
      });
    },
  },
  watch: {
    checkedList(newValue) {
      console.log(newValue);
      if (typeof newValue !== undefined && newValue) {
        if (newValue.indexOf(this.recipeId.toString()) === -1) {
          this.checkedRecipe = false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/recipe-box.sass";
.recipe-name {
  font-size: 1vw;
  @media (max-width: 1500px) {
    font-size: 1.4vw;
  }
  @media (max-width: 500px) {
    font-size: 4vw;
  }
}
</style>

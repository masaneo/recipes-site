<template>
  <div>
    <input type="text" v-model="recipeName" placeholder="Nazwa przepisu" />
  </div>
  <div class="ingredients">
    <AddIngredientToRecipe
      v-for="ingredient in ingredients"
      :key="ingredient.id"
      :id="ingredient.id"
      :units="units"
      @change.once="addIngredient"
      @remove="removeElement"
    />
    <div class="cookingSteps">
      <p></p>
    </div>
    <button type="submit" @click="doSomething">Dodaj przepis</button>
  </div>
</template>

<script>
// @ is an alias to /src
import AddIngredientToRecipe from "@/components/AddIngredientToRecipe.vue";
import axios from "axios";
import router from "@/router";

export default {
  name: "AddRecipeView",
  components: {
    AddIngredientToRecipe,
  },
  data() {
    return {
      userId: Number,
      index: 1,
      ingredients: [{ id: 0, name: "div0" }],
      categoryList: "",
      units: "",
    };
  },
  methods: {
    addIngredient() {
      this.ingredients.push({
        id: this.index,
        name: "div" + this.index,
      });
      console.log(this.index);
      this.index++;
    },
    removeElement(id) {
      const index = this.ingredients.findIndex((f) => f.id === id);
      this.ingredients.splice(index, 1);
    },
  },
  mounted() {
    // check if logged in otherwise redirect to home page
    if (!this.$store.state.token) {
      router.push("/");
    }
    // get all units from api
    axios
      .get("http://localhost:8000/api/recipes/units/getAllUnits")
      .then((response) => {
        console.log(response);
        if (response.data.units) {
          this.units = response.data.units;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // get all categories from api
    axios
      .get("http://localhost:8000/api/recipes/categories/getAllCategories")
      .then((response) => {
        console.log(response);
        if (response.data.categories) {
          this.categoryList = response.data.categories;
        }
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

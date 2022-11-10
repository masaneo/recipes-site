<template>
  <div>
    <input type="text" v-model="recipeName" placeholder="Nazwa przepisu" />
    <select
      v-for="cat in categories"
      :key="cat.id"
      v-model="categoryModels[cat.id].categoryId"
      @change.once="addCategory"
    >
      <option value="0">Wybierz kategorię</option>
      <option
        v-for="category in categoryList"
        :key="category.id"
        :value="category.categoryId"
      >
        {{ category.name }}
      </option>
    </select>
  </div>
  <div class="ingredients">
    <div
      class="ingredient-row"
      v-for="ingredient in ingredients"
      :key="ingredient.id"
      :id="ingredient.id"
      @change.once="addIngredient"
    >
      <input
        type="text"
        v-model="ingredientModels[ingredient.id].ingredient"
        placeholder="Podaj składnik"
      />
      <input
        type="number"
        v-model="ingredientModels[ingredient.id].quantity"
        placeholder="Ilość"
      />
      <select v-model="ingredientModels[ingredient.id].unit">
        <option value="0">Wybierz jednostke miary</option>
        <option v-for="unit in units" :value="unit.id" :key="unit.id">
          {{ unit.name }}
        </option>
      </select>
      <button type="submit" @click="deleteIngredientRow(ingredient.id)">
        Usuń ten wiersz
      </button>
    </div>
    <div class="cookingSteps">
      <div class="cookingStep-row" v-for="step in steps" :key="step.id">
        <label>Krok {{ step.id + 1 }}</label>
        <textarea
          v-model="stepModels[step.id].step"
          @change.once="addStep"
        ></textarea>
        <button type="submit" @click="deleteStepRow(step.id)">
          Usuń ten krok
        </button>
      </div>
    </div>
    <button type="submit" @click="doSomething">Dodaj przepis</button>
  </div>
</template>

<script>
// @ is an alias to /src
//import AddIngredientToRecipe from "@/components/AddIngredientToRecipe.vue";
import axios from "axios";
import router from "@/router";

export default {
  name: "AddRecipeView",
  components: {},
  data() {
    return {
      recipeName: "",
      userId: Number,
      index: 1,
      stepIndex: 1,
      categoryIndex: 1,
      ingredients: [{ id: 0, name: "div0" }],
      steps: [{ id: 0, name: "div0" }],
      categories: [{ id: 0, name: "div0" }],
      passedData: [],
      ingredientModels: [{ ingredient: "", quantity: "", unit: "" }],
      stepModels: [{ step: "" }],
      categoryModels: [{ categoryId: "" }],
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
      this.ingredientModels.push({ ingredient: "", quantity: "", unit: "" });
      console.log(this.index);
      this.index++;
    },
    addStep() {
      this.steps.push({
        id: this.stepIndex,
        name: "div" + this.stepIndex,
      });
      this.stepModels.push({
        step: "",
      });
      this.stepIndex++;
    },
    addCategory() {
      this.categories.push({
        id: this.categoryIndex,
        name: "div" + this.categoryIndex,
      });
      this.categoryModels.push({
        categoryId: "",
      });
      this.categoryIndex++;
    },
    deleteIngredientRow(id) {
      const index = this.ingredients.findIndex((f) => f.id === id);
      this.ingredients.splice(index, 1);
      this.ingredientModels[index] = { ingredient: "", quantity: "", unit: "" };
    },
    deleteStepRow(id) {
      const index = this.steps.findIndex((f) => f.id === id);
      this.steps.splice(index, 1);
      this.stepModels[index] = { step: "" };
    },
    doSomething() {
      axios
        .post("http://localhost:8000/api/recipes/addRecipe", {
          token: this.$store.state.token,
          name: this.recipeName,
          steps: this.stepModels,
          ingredients: this.ingredientModels,
          categories: this.categoryModels,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
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

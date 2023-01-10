<template>
  <div class="add-recipe-container">
    <div v-if="stage >= 1" class="title-div" @change.once="stage++">
      <v-text-field
        label="Nazwa przepisu"
        v-model="recipeName"
        class="title-field"
      />
      <v-file-input
        label="Zdjęcie potrawy"
        truncate-length="15"
        type="file"
        class="file-input"
        @change="getPicture(this.file)"
        accept="image/jpeg, image/png"
      />
    </div>
    <div class="category-div" v-if="stage >= 2">
      <v-select
        v-for="cat in categories"
        :key="cat.id"
        :items="categoryList"
        item-title="name"
        item-value="categoryId"
        label="Wybierz kategorię"
        v-model="categoryModels[cat.id].categoryId"
        @update:modelValue.once="stage++"
      >
      </v-select>
    </div>
    <div class="ingredients" v-if="stage >= 3" @change.once="stage++">
      <div
        class="ingredient-row"
        v-for="ingredient in ingredients"
        :key="ingredient.id"
        :id="ingredient.id"
        @change.once="addIngredient"
      >
        <v-text-field
          class="ingredient-field"
          type="text"
          label="Podaj składnik"
          v-model="ingredientModels[ingredient.id].ingredient"
        />
        <v-text-field
          class="amount-field"
          type="number"
          min="0"
          v-model="ingredientModels[ingredient.id].quantity"
          label="Podaj ilość"
        />
        <v-select
          class="unit-field"
          v-model="ingredientModels[ingredient.id].unit"
          :items="units"
          item-title="name"
          item-value="id"
          label="Wybierz jednostkę miary"
        >
        </v-select>
        <v-btn
          class="ingredient-del-btn"
          color="error"
          @click="deleteIngredientRow(ingredient.id)"
        >
          <i class="fa-regular fa-trash-can"></i>
        </v-btn>
      </div>
      <div class="cooking-steps" v-if="stage >= 4" @change.once="stage++">
        <div class="cooking-step-row" v-for="step in steps" :key="step.id">
          <v-textarea
            class="cooking-step-textarea"
            v-model="stepModels[step.id].step"
            :label="'Krok ' + (step.id + 1)"
            @change.once="addStep"
          ></v-textarea>
          <v-btn
            class="cooking-step-del-btn"
            color="error"
            type="submit"
            @click="deleteStepRow(step.id)"
          >
            <i class="fa-regular fa-trash-can"></i>
          </v-btn>
        </div>
      </div>
      <v-btn
        color="success"
        v-if="stage >= 5"
        type="submit"
        @click="sendRecipe"
      >
        Dodaj przepis
      </v-btn>
    </div>
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
      stage: 1,
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
      categoryList: [],
      units: "",
      image: "",
      value: null,
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
      if (this.stage === 2) this.stage++;
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
    getPicture() {
      const file = document.querySelector("input[type=file]").files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        this.image = reader.result;
      };
      reader.readAsDataURL(file);
    },
    sendRecipe() {
      axios
        .post("http://localhost:8000/api/recipes/addRecipe", {
          token: this.$store.state.token,
          name: this.recipeName,
          steps: this.stepModels,
          ingredients: this.ingredientModels,
          categories: this.categoryModels,
          image: this.image,
          test: "test",
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
        if (response.data.units) {
          this.units = response.data.units;
          console.log(this.units);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // get all categories from api
    axios
      .get("http://localhost:8000/api/recipes/categories/getAllCategories")
      .then((response) => {
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
@import "@/assets/styles/add-recipe-view.sass";
</style>

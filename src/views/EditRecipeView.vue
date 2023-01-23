<template>
  <div class="add-recipe-container" v-if="showData">
    <div class="title-div">
      <v-text-field
        label="Nazwa przepisu"
        v-model="recipeName"
        class="title-field"
        hide-details="auto"
      />
      <v-file-input
        label="Zdjęcie potrawy"
        truncate-length="15"
        type="file"
        class="file-input"
        @change="getPicture(this.file)"
        accept="image/jpeg, image/png"
        hide-details="auto"
      />
    </div>
    <div class="category-div">
      <v-select
        v-for="cat in categories"
        :key="cat.id"
        :items="categoryList"
        item-title="name"
        item-value="categoryId"
        label="Wybierz kategorię"
        v-model="categoryModels[cat.id].categoryId"
        hide-details="auto"
      >
      </v-select>
    </div>
    <div class="ingredients">
      <div
        class="ingredient-row"
        v-for="ingredient in ingredients"
        :key="ingredient.id"
        :id="ingredient.id"
      >
        <v-text-field
          class="ingredient-field"
          type="text"
          label="Podaj składnik"
          v-model="ingredientModels[ingredient.id].ingredient"
          hide-details="auto"
          @update:modelValue.once="addIngredient"
        />
        <v-text-field
          class="amount-field"
          type="number"
          min="0"
          v-model="ingredientModels[ingredient.id].quantity"
          label="Podaj ilość"
          hide-details="auto"
        />
        <v-select
          class="unit-field"
          v-model="ingredientModels[ingredient.id].unit"
          :items="units"
          item-title="name"
          item-value="id"
          label="Wybierz jednostkę miary"
          hide-details="auto"
        >
        </v-select>
        <v-btn
          class="ingredient-del-btn"
          color="error"
          @click="deleteIngredientRow(ingredient.id)"
          hide-details="auto"
        >
          <i class="fa-regular fa-trash-can"></i>
        </v-btn>
      </div>
    </div>
    <div class="cooking-steps" @change.once="stage++">
      <div class="cooking-step-row" v-for="step in steps" :key="step.id">
        <v-textarea
          class="cooking-step-textarea"
          v-model="stepModels[step.id].step"
          :label="'Krok ' + (step.id + 1)"
          @update:modelValue.once="addStep"
          hide-details="auto"
        ></v-textarea>
        <v-btn
          class="cooking-step-del-btn"
          color="error"
          type="submit"
          @click="deleteStepRow(step.id)"
          hide-details="auto"
        >
          <i class="fa-regular fa-trash-can"></i>
        </v-btn>
      </div>
    </div>
    <v-btn color="success" type="submit" @click="saveRecipe">
      Zapisz zmiany
    </v-btn>
  </div>
</template>
<script>
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      showData: false,
      recipe: [],
      units: [],
      categoryList: [],
      categories: [{ id: 0, name: "div0" }],
      categoryModels: [],
      ingredients: [],
      ingredientModels: [],
      steps: [],
      stepModels: [],
      index: 1,
      stepIndex: 1,
      categoryIndex: 1,
      recipeName: "",
      image: "",
    };
  },
  async mounted() {
    // check if logged in otherwise redirect to home page
    if (!this.$store.state.token) {
      await router.push("/");
    }
    // get recipe data
    await axios
      .get(process.env.VUE_APP_API_BASEURL + "recipes/getRecipeData", {
        params: {
          id: this.$route.params.id,
          token: this.$store.state.token,
        },
      })
      .then((res) => {
        if (res.data.name !== null) {
          this.showData = true;
          this.recipe = res.data;
          this.recipeName = res.data.recipe.name;
          this.categoryModels.push({
            categoryId: res.data.category.categoryId,
          });
          res.data.ingredients.forEach((i) => {
            this.ingredients.push({
              id: i.ingredientId,
              name: "div" + i.ingredientId,
              required: true,
            });
            this.ingredientModels[i.ingredientId] = {
              id: i.ingredientId,
              ingredient: i.name,
              unit: i.unit,
              quantity: i.amount,
            };
            this.index = i.ingredientId + 1;
          });
          res.data.cookingSteps.forEach((i) => {
            this.steps.push({
              id: i.stepId,
              name: "div" + i.stepId,
              required: true,
            });
            this.stepModels.push({
              id: i.stepId,
              step: i.step,
            });
            this.stepIndex = i.stepId + 1;
          });
          this.addIngredient();
          this.addStep();
        } else {
          this.showData = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // get all units from api
    axios
      .get(process.env.VUE_APP_API_BASEURL + "recipes/units/getAllUnits")
      .then((response) => {
        if (response.data.units) {
          this.units = response.data.units;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        process.env.VUE_APP_API_BASEURL + "recipes/categories/getAllCategories"
      )
      .then((response) => {
        if (response.data.categories) {
          this.categoryList = response.data.categories;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    addIngredient() {
      this.ingredients.push({
        id: this.index,
        name: "div" + this.index,
        required: false,
      });
      this.ingredientModels[this.index] = {
        ingredient: "",
        quantity: "",
        unit: "",
      };
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
    saveRecipe() {
      axios
        .put(process.env.VUE_APP_API_BASEURL + "recipes/modifyRecipe", {
          token: this.$store.state.token,
          id: this.recipe.recipe.recipeId,
          name: this.recipeName,
          steps: this.stepModels,
          ingredients: this.ingredientModels,
          categories: this.categoryModels,
          image: this.image,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log("saving data");
      // console.log(this.recipeName);
      // console.log(this.recipe.recipe.recipeId);
      // console.log(this.stepModels);
      // console.log(this.ingredientModels);
      // console.log(this.categoryModels);
      // console.log(this.image);
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/add-recipe-view.sass";
</style>
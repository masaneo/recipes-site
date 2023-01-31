<template>
  <div class="content-container">
    <div class="search-section">
      <h1>Znajdź przepis na bazie posiadanych składników</h1>
      <div class="details">
        W obecnych czasach, podczas robienia zakupów, często zdarza nam się
        nabywać nadmierne ilości produktów, których w rzeczywistości nie
        potrzebujemy w tak wielkim stopniu. Niestety, marnowanie żywności jest
        powszechnym zjawiskiem, dlatego też oferujemy funkcję, dzięki której
        możesz podać nam informację o składnikach, których masz za dużo lub
        których termin ważności wkrótce wygaśnie, a my z przyjemnością
        znajdziemy dla Ciebie smaczne i praktyczne przepisy kulinarne!
      </div>
      <div class="search-row-cont">
        <h3>Podaj nam jakie składniki posiadasz</h3>
        <div class="search-row">
          <input
            type="text"
            placeholder="Wymień je po przecinku tutaj"
            v-model="ingredientString"
            @keyup.enter="sendIngredients"
          />
          <button type="button" @click="sendIngredients">Prześlij</button>
        </div>
      </div>
    </div>
    <div class="find-recipe-header" v-if="ready">
      Dania które można przyrządzić z tych składników
    </div>
    <div class="recipes-section" v-if="ready">
      <div class="not-found" v-if="recipes.length === 0">
        Nie znaleziono żadnych przepisów, sprawdź czy dobrze wpisałeś nazwy oraz
        czy wszystkie składniki oddzielone są od siebie przecinkami
      </div>
      <SingleRecipe
        v-for="recipe in recipes"
        :key="recipe.recipeId"
        :recipe-name="recipe.name"
        :recipe-id="recipe.recipeId"
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import SingleRecipe from "@/components/SingleRecipe";

export default {
  components: { SingleRecipe },
  props: {},
  data() {
    return {
      ready: false,
      ingredientString: "",
      recipes: [],
    };
  },
  mounted() {},
  methods: {
    sendIngredients() {
      axios
        .get(process.env.VUE_APP_API_BASEURL + "recipes/findRecipes", {
          params: {
            ingredientList: this.ingredientString,
          },
        })
        .then((response) => {
          this.recipes = response.data;
          this.ready = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/find-recipe-view.sass";
</style>

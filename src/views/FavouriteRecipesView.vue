<template>
  <div class="recipes-container">
    <div class="recipes" v-if="ready">
      <div class="header-row">
        <div class="header">Twoje ulubione przepisy</div>
        <v-btn class="add-button" @click="addIngredientsFromCheckedListRecipes"
          >Dodaj zaznaczone do listy zakupów</v-btn
        >
      </div>
      <p>
        Aby dodać przepis do listy zakupów zaznacz checkbox z prawej strony
        nazwy przepisu, a następnie kliknij przycisk powyżej
      </p>
      <div class="header" v-if="recipes.data.length === 0">
        Brak ulubionych przepisów
      </div>
      <SingleRecipe
        v-for="item in recipes.data"
        :key="item.recipeId"
        :recipeName="item.name"
        :recipeId="item.recipeId"
        :favourite="true"
        :checkedList="selectedRecipes"
        @selected="addToCheckedList"
      />
    </div>
    <vue-awesome-paginate
      :total-items="recipes.total"
      :items-per-page="recipes.per_page"
      :max-pages-shown="5"
      :on-click="changePageHandler"
      v-model="curPage"
      v-if="recipes.total > recipes.per_page"
      class="paginate-bar"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import SingleRecipe from "@/components/SingleRecipe.vue";
import { VueAwesomePaginate } from "vue-awesome-paginate";
import axios from "axios";
import router from "@/router";

export default {
  name: "FavouriteRecipesView",
  components: {
    SingleRecipe,
    VueAwesomePaginate,
  },
  data: function () {
    return {
      ready: false,
      recipes: [],
      curPage: 1,
      links: [],
      selectedRecipes: [],
    };
  },
  methods: {
    addToCheckedList(event) {
      if (event.newSelection) {
        this.selectedRecipes.push(event.recipeId);
      } else {
        var index = this.selectedRecipes.indexOf(event.recipeId);
        if (index !== -1) {
          this.selectedRecipes.splice(index, 1);
        }
      }
    },
    changePageHandler(page) {
      router.push({ query: { page: page } });
      this.getRecipesData(page);
      this.curPage = page;
    },
    getRecipesData(page) {
      axios
        .get(this.links[page].url, {
          params: {
            token: this.$store.state.token,
            categoryId: this.categoryId,
          },
        })
        .then((response) => {
          this.ready = true;
          this.recipes = response.data;
          this.links = response.data.links;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addIngredientsFromCheckedListRecipes() {
      this.selectedRecipes.forEach((element) => {
        console.log(element);
        this.addIngredientsToShoppingList(element);
      });
      this.selectedRecipes = [];
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
  },
  async mounted() {
    await axios
      .get(process.env.VUE_APP_API_BASEURL + "recipes/getFavouriteRecipes", {
        params: {
          token: this.$store.state.token,
        },
      })
      .then((res) => {
        this.ready = true;
        this.recipes = res.data;
        this.links = res.data.links;
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/home-view.sass";
</style>

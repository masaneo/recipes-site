import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "@/views/RegisterView";
import LoginView from "@/views/LoginView";
import RecipeView from "@/views/RecipeView";
import AddRecipeView from "@/views/AddRecipeView";
import UserRecipesView from "@/views/UserRecipesView";
import FavouriteRecipesView from "@/views/FavouriteRecipesView";
import RecipesRankingView from "@/views/RecipesRankingView";
import FindRecipeView from "@/views/FindRecipeView";
import EditRecipeView from "@/views/EditRecipeView";
import RecipesByCategoryView from "@/views/RecipesByCategoryView";
import AdminPanelView from "@/views/AdminPanelView";
import VerificationDetailsView from "@/views/VerificationDetailsView";
import VerificationView from "@/views/VerificationView";
import ShoppingListView from "@/views/ShoppingListView";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/recipes/:id",
    name: "SingleRecipe",
    component: RecipeView,
  },
  {
    path: "/recipes/addRecipe",
    name: "AddRecipe",
    component: AddRecipeView,
  },
  {
    path: "/recipes/myRecipes",
    name: "UserRecipes",
    component: UserRecipesView,
  },
  {
    path: "/recipes/favouriteRecipes",
    name: "FavouriteRecipes",
    component: FavouriteRecipesView,
  },
  {
    path: "/recipes/ranking",
    name: "RecipesRanking",
    component: RecipesRankingView,
  },
  {
    path: "/recipes/findRecipe",
    name: "FindRecipe",
    component: FindRecipeView,
  },
  {
    path: "/recipes/editRecipe/:id",
    name: "EditRecipe",
    component: EditRecipeView,
  },
  {
    path: "/recipes/categories/:id",
    name: "RecipesByCategory",
    component: RecipesByCategoryView,
  },
  {
    path: "/recipes/adminPanel",
    name: "AdminPanelView",
    component: AdminPanelView,
  },
  {
    path: "/verification/details",
    name: "VerificationDetailsView",
    component: VerificationDetailsView,
  },
  {
    path: "/verify",
    name: "VerificationView",
    component: VerificationView,
  },
  {
    path: "/shoppingList",
    name: "ShoppingListView",
    component: ShoppingListView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

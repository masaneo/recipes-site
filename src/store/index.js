import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {
    token: "",
    shoppingList: [],
  },
  getters: {},
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    addToShoppingList(state, itz) {
      if (state.shoppingList.length > 0) {
        for (let i = 0; i < state.shoppingList.length; i++) {
          if (
            state.shoppingList[i].ingredientId === itz.ingredientId &&
            state.shoppingList[i].unit === itz.unit
          ) {
            state.shoppingList[i].amount =
              parseFloat(state.shoppingList[i].amount) + parseFloat(itz.amount);
          } else {
            state.shoppingList.push(itz);
          }
        }
      } else {
        state.shoppingList.push(itz);
      }

      // if (state.shoppingList.includes(items)) {
      //   state.shoppingList.forEach(function (itz) {
      //     if (
      //       itz.ingredientId === items.ingredientId &&
      //       itz.unit === items.unit
      //     ) {
      //       itz.amount = parseFloat(itz.amount) + parseFloat(items.amount);
      //     }
      //   });
      // } else {
      //   state.shoppingList.push(items);
      // }
    },
    clearShoppingList(state) {
      state.shoppingList.length = 0;
    },
  },
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});

export default store;

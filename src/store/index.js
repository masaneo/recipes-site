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
      let found = false;
      if (state.shoppingList.length > 0) {
        for (let i = 0; i < state.shoppingList.length; i++) {
          if (
            state.shoppingList[i].ingredientId === itz.ingredientId &&
            state.shoppingList[i].unit === itz.unit
          ) {
            state.shoppingList[i].amount =
              parseFloat(state.shoppingList[i].amount) + parseFloat(itz.amount);
            found = true;
            break;
          } else {
            found = false;
          }
        }
      } else {
        state.shoppingList.push(itz);
        found = true;
      }
      if (!found) {
        state.shoppingList.push(itz);
      }
    },
    clearShoppingList(state) {
      state.shoppingList.length = 0;
    },
    removeFromShoppingList(state, index) {
      state.shoppingList.splice(index, 1);
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

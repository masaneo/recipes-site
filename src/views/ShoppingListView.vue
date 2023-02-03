<template>
  <div class="shopping-list">
    <div class="header-row">
      <div class="header">Lista zakupów</div>
      <div class="control-buttons">
        <i
          class="fas fa-print shopping-list-icon control-icon"
          @click="printShoppingList"
          v-if="!isShoppingListEmpty"
        ></i>
        &nbsp;
        <i
          class="fa-solid fa-at control-icon"
          v-if="!isShoppingListEmpty && this.$store.state.token"
          @click="sendToEmail"
        ></i>
        <v-btn class="control-btn" color="error" @click="clearShoppingList"
          >Wyczyść</v-btn
        >
      </div>
    </div>
    <div class="content">
      <div
        class="ingredient-row"
        v-for="(ingredient, index) in this.$store.state.shoppingList"
        :key="index"
      >
        <div class="ingredient">
          {{
            ingredient.amount + " " + ingredient.unit + " " + ingredient.name
          }}
        </div>
        <div class="del-button">
          <v-btn
            class="control-btn"
            color="error"
            @click="removeFromShoppingList(index)"
            hide-details="auto"
          >
            <i class="fa-regular fa-trash-can"></i>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import axios from "axios";
// import router from "@/router";

import axios from "axios";

export default {
  name: "UserRecipesView",
  components: {},
  data: function () {
    return {};
  },
  methods: {
    clearShoppingList() {
      this.$store.commit("clearShoppingList");
    },
    removeFromShoppingList(index) {
      console.log("removing" + index);
      console.log(this.$store.state.shoppingList);
      this.$store.commit("removeFromShoppingList", index);
    },
    printShoppingList() {
      let stylesHtml = "";
      const prtHtml = document.getElementById("print").innerHTML;
      const WinPrint = window.open(
        "",
        "xd",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0 popup"
      );
      WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
            ${stylesHtml}
            <title>Lista zakupów</title>
          </head>
          <body>
            ${prtHtml}
          </body>
        </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      window.setTimeout(() => {
        WinPrint.close();
      }, 100);
    },
    sendToEmail() {
      axios
        .post(process.env.VUE_APP_API_BASEURL + "shoppingList/sendToEmail", {
          shoppingList: this.$store.state.shoppingList,
          token: this.$store.state.token,
        })
        .then((res) => {
          console.log(res);
          alert("Pomyślnie wysłano listę zakupów");
        });
    },
  },
  mounted() {},
  computed: {
    isShoppingListEmpty() {
      return this.$store.state.shoppingList.length === 0;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/shopping-list.sass";
</style>

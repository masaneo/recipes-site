import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { VueAwesomePaginate } from "vue-awesome-paginate";

loadFonts();
import "vue-awesome-paginate/dist/style.css";

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(VueAwesomePaginate)
  .mount("#app");

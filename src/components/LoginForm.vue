<template>
  <div class="login-form">
    <input
      type="text"
      name="email"
      placeholder="Podaj email"
      v-model="email"
    /><br />
    <input
      type="password"
      name="password"
      placeholder="Podaj hasło"
      v-model="password"
    /><br />
    <input type="submit" name="submit" v-on:click="login()" value="Zaloguj" />
  </div>
  <div v-if="succeed === true">
    <h1>Logowanie przebiegło pomyślnie token: {{ token }}</h1>
  </div>
  <div v-if="succeed === false">
    <h1>Logowanie nie powiodło się</h1>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      succeed: "",
      token: "",
    };
  },
  methods: {
    async login() {
      if (this.password && this.email) {
        await axios
          .post("http://localhost:8000/api/users/auth", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            console.log(response);
            if (response.data.token) {
              this.token = response.data.token;
              if (!localStorage.getItem("token")) {
                localStorage.setItem("token", response.data.token);
              }
              this.succeed = true;
              router.push("/");
            }
            this.succeed = false;
          })
          .catch((error) => {
            console.log(error);
            this.succeed = false;
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/user-forms.sass";
</style>

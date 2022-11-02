<template>
  <div class="register-form">
    <input
      type="text"
      name="username"
      placeholder="Podaj swoją nazwę użytkownika"
      v-model="username"
    /><br />
    <input
      type="password"
      name="password"
      placeholder="Podaj hasło"
      v-model="password"
    /><br />
    <input
      type="password"
      name="repeatPassword"
      placeholder="Powtórz hasło"
      v-model="repeatPassword"
    /><br />
    <input
      type="text"
      name="email"
      placeholder="Podaj email"
      v-model="email"
    /><br />
    <input
      type="submit"
      name="submit"
      v-on:click="register()"
      value="Zarejestruj"
    />
  </div>
  <div v-if="succeed === true">
    <h1>Rejestracja przebiegła pomyślnie</h1>
  </div>
  <div v-if="succeed === false">
    <h1>Rejestracja nie powiodła się</h1>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      succeed: "",
    };
  },
  methods: {
    async register() {
      if (this.username && this.password && this.repeatPassword && this.email) {
        if (this.password === this.repeatPassword) {
          await axios
            .post("http://localhost:8000/api/users", {
              email: this.email,
              password: this.password,
              username: this.username,
            })
            .then((response) => {
              console.log(response);
              this.succeed = true;
            })
            .catch((error) => {
              console.log(error);
              this.succeed = false;
            });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/user-forms.sass";
</style>

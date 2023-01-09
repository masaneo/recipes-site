<template>
  <div class="register-form">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        type="text"
        label="Nazwa użytkownika"
        name="username"
        :rules="usernameRules"
        hide-details="auto"
        v-model="username"
      /><br />
      <v-text-field
        type="text"
        name="email"
        label="Podaj email"
        :rules="emailRules"
        v-model="email"
      /><br />
      <v-text-field
        type="password"
        name="password"
        label="Podaj hasło"
        hide-details="auto"
        :rules="passwordRules"
        v-model="password"
      /><br />
      <v-text-field
        type="password"
        name="repeatPassword"
        label="Powtórz hasło"
        hide-details="auto"
        :rules="repeatedPasswordRules.concat(passwordRules)"
        v-model="repeatPassword"
      /><br />
      <v-btn color="success" class="mr-4" @click="register()"
        >Zarejestruj</v-btn
      >
    </v-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      valid: false,
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      succeed: "",
      usernameRules: [(value) => !!value || "Pole wymagane."],
      passwordRules: [
        (value) => !!value || "Pole wymagane.",
        (value) =>
          (value && value.length >= 4) ||
          "Hasło musi się składać z przynajmniej 8 znaków",
      ],
      repeatedPasswordRules: [
        (value) => value === this.password || "Hasło się nie zgadza",
      ],
      emailRules: [
        (value) => !!value || "Pole wymagane.",
        (value) => /.+@.+/.test(value) || "Nieprawidłowy adres e-mail",
      ],
    };
  },
  methods: {
    async register() {
      this.validation();
      if (
        this.username &&
        this.password &&
        this.repeatPassword &&
        this.email &&
        this.valid
      ) {
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
    validation() {
      this.$refs.form.validate();
    },
  },
};
</script>

<template>
  <v-container>
    <div class="error-div" v-if="failed">{{ message }}</div>
    <v-form ref="form" v-model="valid" lazy-validation class="user-form">
      <v-text-field
        type="text"
        label="Nazwa użytkownika"
        name="username"
        :rules="usernameRules"
        hide-details="auto"
        v-model="username"
      />
      <v-text-field
        type="text"
        name="email"
        label="Podaj email"
        hide-details="auto"
        :rules="emailRules"
        v-model="email"
      />
      <v-text-field
        type="password"
        name="password"
        label="Podaj hasło"
        hide-details="auto"
        :rules="passwordRules"
        v-model="password"
      />
      <v-text-field
        type="password"
        name="repeatPassword"
        label="Powtórz hasło"
        hide-details="auto"
        :rules="repeatedPasswordRules.concat(passwordRules)"
        v-model="repeatPassword"
      />
      <v-btn color="success" class="mr-4" @click="register()"
        >Zarejestruj</v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      valid: false,
      failed: false,
      message: "",
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
            .post(process.env.VUE_APP_API_BASEURL + "users", {
              email: this.email,
              password: this.password,
              username: this.username,
            })
            .then((response) => {
              if (response.data.message) {
                this.message = response.data.message;
                this.failed = true;
                console.log(response.data.message);
              } else {
                router.push("/login");
                this.failed = false;
              }
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

<style scoped lang="scss">
.error-div {
  background-color: rgba(252, 58, 40, 0.75);
  padding: 10px;
  font-size: 1.2em;
  color: white;
}
.user-form {
  display: flex;
  height: 75%;
  flex-direction: column;
  gap: 2%;
  .v-btn {
    width: 100%;
  }
}
</style>

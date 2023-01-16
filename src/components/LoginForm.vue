<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        type="text"
        label="E-mail"
        name="email"
        v-model="email"
        hide-details="auto"
        :rules="emailRules"
      ></v-text-field>
      <br />
      <v-text-field
        label="Password"
        type="password"
        name="password"
        v-model="password"
        :rules="passwordRules"
        hide-details="auto"
      /><br />
      <v-btn color="success" class="mr-4" @click="login"> Zaloguj </v-btn>
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
      succeed: "",
      token: "",
      email: "",
      password: "",
      emailRules: [
        (value) => !!value || "Pole wymagane.",
        (value) => /.+@.+/.test(value) || "Nieprawidłowy adres e-mail",
      ],
      passwordRules: [
        (value) => !!value || "Pole wymagane.",
        (value) =>
          (value && value.length >= 4) ||
          "Hasło musi się składać z przynajmniej 8 znaków",
      ],
    };
  },
  methods: {
    async login() {
      this.validation();
      if (this.password && this.email && this.valid) {
        await axios
          .post(process.env.VUE_APP_API_BASEURL + "users/auth", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            console.log(response);
            if (response.data.token) {
              this.token = response.data.token;
              if (!this.$store.state.token) {
                this.$store.commit("setToken", response.data.token);
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
    validation() {
      this.$refs.form.validate();
    },
  },
};
</script>

<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      class="user-form"
      @keyup.enter="login"
    >
      <div v-if="failed" class="error-div">{{ message }}</div>
      <v-text-field
        type="text"
        label="E-mail"
        name="email"
        v-model="email"
        hide-details="auto"
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        label="Hasło"
        type="password"
        name="password"
        v-model="password"
        :rules="passwordRules"
        hide-details="auto"
      />
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
      message: "",
      failed: false,
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
          (value && value.length >= 8) ||
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
            if (response.data.token) {
              this.token = response.data.token;
              sessionStorage.setItem("username", response.data.user.username);
              if (!this.$store.state.token) {
                this.$store.commit("setToken", response.data.token);
                if (response.data.admin === true) {
                  sessionStorage.setItem("admin", true);
                }
              }
              this.failed = false;
              this.message = "";
              router.push("/");
            }
            this.failed = true;
            this.message = response.data.message;
          })
          .catch((error) => {
            console.log(error);
            this.failed = true;
          });
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
  height: 45%;
  flex-direction: column;
  gap: 20px;
  .v-btn {
    width: 100%;
  }
}
</style>

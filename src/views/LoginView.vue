<template>
  <div class="login-container">
    <div class="login-image"></div>
    <div class="login">
      <h1>Zaloguj się</h1>
      <LoginForm />
      <div class="details">
        Nie posiadasz jeszcze swojego konta? Możesz je utworzyć
        <span class="redirect" @click="redirectToRegister">tutaj</span>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import router from "@/router";
export default {
  components: {
    LoginForm,
  },
  methods: {
    redirectToRegister() {
      router.push("/register");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/user-forms.sass";
.login-image {
  background-image: url("~@/assets/images/chef-presenting.jpg");
}
</style>

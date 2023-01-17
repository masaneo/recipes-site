<template>
  <div class="login-container">
    <div class="login-image"></div>
    <div class="login">
      <h1>Zaloguj się</h1>
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
export default {
  components: {
    LoginForm,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/user-forms.sass";
.login-image {
  background-image: url("~@/assets/images/chef-presenting.jpg");
}
</style>

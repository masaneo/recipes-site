<template>
  <div class="register-container">
    <div class="register-image"></div>
    <div class="register">
      <h1>Zarejestruj się</h1>
      <RegisterForm />
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue";
export default {
  components: {
    RegisterForm,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/user-forms.sass";
.register-image {
  background-image: url("~@/assets/images/chef-pointing.jpg");
}
</style>

<template>
  <div class="login-container">
    <div class="login">
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
</style>

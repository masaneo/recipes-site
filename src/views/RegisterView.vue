<template>
  <div class="register-container">
    <div class="register">
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
</style>

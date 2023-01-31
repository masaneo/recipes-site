<template>
  <div class="register-container">
    <div class="register-image"></div>
    <div class="register">
      <h1>Zarejestruj się</h1>
      <div class="details">
        Utwórz konto, aby uzyskać możliwość dodawania własnych przepisów,
        oceniania przepisów innych użytkowników oraz dodawania ich do listy
        ulubionych.
      </div>
      <RegisterForm />
      <div class="details">
        Jeżeli posiadasz już konto naciśnij
        <span class="redirect" @click="redirectToLogin">tutaj</span>, aby się
        zalogować
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue";
import router from "@/router";
export default {
  components: {
    RegisterForm,
  },
  methods: {
    redirectToLogin() {
      router.push("/login");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/user-forms.sass";
.register-image {
  background-image: url("~@/assets/images/chef-pointing.jpg");
}
</style>

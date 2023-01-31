<template>
  <div class="verification-details-text">
    <span class="mail-span">
      Na twój adres e-mail (<span class="email">{{ email }}</span
      >) wysłaliśmy wiadomość z linkiem do aktywacji twojego konta.
    </span>
    <br />
    <span class="continue-span"
      >Aby kontynuować musisz potwierdzić swój adres e-mail.</span
    >
    <br />
    <span class="intructions-span"
      >Postępuj według instrukcji zawartych w wysłanej wiadomości.</span
    >
    <br />
    <span class="not-received">
      Jeżeli nie dostałeś wiadomości kliknij
      <span class="click-here" @click="resendEmail">tutaj</span> aby wysłać ją
      ponownie.
    </span>
    <br />
    <span class="thanks-span">Dziękujemy!</span>
  </div>
</template>

<script>
import router from "@/router";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      email: "",
    };
  },
  methods: {
    resendEmail() {
      axios
        .post(
          process.env.VUE_APP_API_BASEURL + "users/email/resendVerification",
          {
            email: this.email,
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.succeed = false;
        });
    },
  },
  mounted() {
    this.email = router.currentRoute.value.query.email;
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/verification.sass";
</style>

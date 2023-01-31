<template>
  <div class="verification-succeed-text" v-if="ready">
    <span class="header">{{ message }}</span>
    <br />
    <span class="timer"
      >Zostaniesz przeniesiony na stronę logowania za {{ timer }}s.</span
    >
    <br />
    <span class="not-redirected">
      <a @click="redirectToLogin"
        >Kliknij tutaj jeżeli nie zostałeś przeniesiony</a
      >
    </span>
  </div>
</template>

<script>
import router from "@/router";
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      message: "",
      token: "",
      ready: false,
      timer: 5,
    };
  },
  methods: {
    redirectToLogin() {
      router.push("/login");
    },
  },
  async mounted() {
    this.token = router.currentRoute.value.query.token;
    await axios
      .post(process.env.VUE_APP_API_BASEURL + "users/email/verification", {
        token: this.token,
      })
      .then((response) => {
        if (response.data.message) {
          this.message = response.data.message;
          this.ready = true;
        }
      })
      .catch((error) => {
        console.log(error);
        this.succeed = false;
      });
  },
  watch: {
    timer: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timer--;
          }, 1000);
        }
        if (value === 0) {
          this.redirectToLogin();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/verification.sass";
</style>

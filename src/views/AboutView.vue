<template>
  <div class="about">
    <h1>{{ token }}</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: "",
    };
  },
  mounted() {
    this.token = this.$store.state.token;
  },
};
</script>

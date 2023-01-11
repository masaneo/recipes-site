<template>
  <div class="step">
    <span class="step-span">{{
      stepNumber + 1 + ". " + capitalized(step)
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    step: String,
    stepNumber: Number,
  },
  data() {
    return {};
  },
  methods: {
    capitalized(text) {
      const firstLetter = text[0].toUpperCase();
      const rest = text.slice(1);

      return firstLetter + rest;
    },
  },
};
</script>

<style scoped lang="scss">
//@import "@/assets/styles/step.sass";
</style>

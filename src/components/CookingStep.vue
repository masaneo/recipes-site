<template>
  <div class="step">
    <span class="step-span">{{ stepNumber + 1 + ". " + step }}</span>
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
  methods: {},
};
</script>

<style scoped lang="scss">
//@import "@/assets/styles/step.sass";
</style>

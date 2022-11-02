<template>
  <div class="step">
    <span>Krok {{ stepNumber }}</span>
    <span>{{ step }}</span>
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

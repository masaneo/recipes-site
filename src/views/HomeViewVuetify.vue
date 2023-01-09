<template>
  <HelloWorld />
</template>

<script>
import { defineComponent } from "vue";

// Components
import HelloWorld from "../components/HelloWorld.vue";

export default defineComponent({
  name: "HomeViewVUETIFY",

  components: {
    HelloWorld,
  },
});
</script>

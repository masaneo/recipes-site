<template>
  <div class="ingredient-row" :id="id">
    <input type="text" v-model="ingredient" placeholder="Podaj składnik" />
    <input type="text" v-model="quantity" placeholder="Ilość" />
    <select v-model="ingredientUnit">
      <option value="0">Wybierz jednostke miary</option>
      <option v-for="unit in units" :value="unit.id" :key="unit.id">
        {{ unit.name }}
      </option>
    </select>
    <button type="submit" @click="deleteThisRow(id)">Usuń ten wiersz</button>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    ingredientNumber: Number,
    units: [],
  },
  data() {
    return {
      ingredient: "",
      quantity: "",
      ingredientUnit: 0,
    };
  },
  methods: {
    deleteThisRow(id) {
      return this.$emit("remove", id);
    },
    passData(msg) {
      return {
        id: this.id,
        name: this.ingredient,
        quantity: this.quantity,
        unit: this.ingredientUnit,
        msg: msg,
      };
    },
  },
};
</script>

<style scoped lang="scss">
//@import "@/assets/styles/step.sass";
</style>

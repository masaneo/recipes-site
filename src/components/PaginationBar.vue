<template>
  <div class="pagination">
    <ul>
      <li>
        <button
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
        >
          First
        </button>
      </li>
      <li>
        <button
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
        >
          prev
        </button>
      </li>
      <li v-for="page in pagesArr" :key="page.name">
        <button
          type="button"
          @click="onClickPage(page.name)"
          :disabled="page.isDisabled"
          :class="{ active: isPageActive(page.name) }"
        >
          {{ page.name }}
        </button>
      </li>
      <li>
        <button @click="onClickNextPage" :disabled="isInLastPage">next</button>
      </li>
      <li>
        <button @click="onClickLastPage" :disabled="isInLastPage">Last</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      type: Number,
      required: true,
    },
    visiblePages: {
      type: Number,
      required: false,
      default: 5,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    onClickFirstPage() {
      this.$emit("pagechanged", 1);
    },
    onClickPreviousPage() {
      this.$emit("pagechanged", this.currentPage - 1);
    },
    onClickPage(page) {
      this.$emit("pagechanged", page);
    },
    onClickNextPage() {
      this.$emit("pagechanged", this.currentPage + 1);
    },
    onClickLastPage() {
      this.$emit("pagechanged", this.pages);
    },
    isPageActive(page) {
      return this.currentPage === page;
    },
  },
  computed: {
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      return this.currentPage === this.pages;
    },
    startPage() {
      if (this.currentPage === 1) {
        return 1;
      }
      if (this.currentPage === this.pages) {
        return this.pages - this.visiblePages + 1;
      }
      return this.currentPage - 1;
    },
    endPage() {
      return Math.min(this.startPage + this.visiblePages - 1, this.pages);
    },
    pagesArr() {
      const range = [];
      for (let i = this.startPage; i <= this.endPage; i++) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage,
        });
      }
      return range;
    },
  },
};
</script>

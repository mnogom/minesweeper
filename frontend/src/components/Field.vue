<script setup>
import Cell from "./Cell.vue";
</script>

<template>
<main class="mt-5">
  <div class="row row-cols-auto" v-for="i in level.getHeight()" :key="i">
    <div class="coll p-0" v-for="j in level.getWidth()" :key="j">
      <Cell :value="j"
            :isOpen="false"/>
    </div>
  </div>
</main>
</template>

<script>
export default {
  name: "Field",

  data() {
    return {};
  },

  props: {
    level: { required: true },
  },

  methods: {},
};
</script>

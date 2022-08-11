<template>
<main class="mt-5">
  <div class="row row-cols-auto" v-for="i in level.getHeight()" :key="i">
    <div class="coll p-0" v-for="j in level.getWidth()" :key="j">
      <div class="cell">{{ 1 }}</div>
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

<style scoped>
.cell {
  width: 2rem;
  height: 2rem;
  font-size: small;
  border: 1px solid rgb(196, 196, 196);
  background: rgb(182, 182, 182);
  outline: 1px outset rgba(150, 150, 150, 1);
  margin: 1px;
  font-size: 1.5rem;
  text-align: center;
}
.cell:hover {
  background-color: grey;
}
</style>

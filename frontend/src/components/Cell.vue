<template>
  <div class="cell">{{ value }}</div>
</template>

<script>
  export default {
    name: "Cell",
    props: {
      value: {
        required: true,
        type: Number,
      },
      isOpen: {
        required: true,
        type: Boolean,
      },
    },
  }
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
  font-size: 1.3rem;
  text-align: center;
}
.cell:active {
	outline: 0px;
}
</style>

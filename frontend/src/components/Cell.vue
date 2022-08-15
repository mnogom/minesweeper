<template>
  <div
    class="cell user-select-none"
    :class="{
      opened: cell.isOpened(),
      flagged: cell.isFlagged(),
      mine: cell.isOpened() && cell.isMine(),
    }"
    :value-number="cell.isOpened() ? cell.getValue() : null"
    @click="$emit('touch', cell)"
    @contextmenu.prevent="$emit('toggle-flag', cell)"
  >
    {{ renderCell(cell) }}
  </div>
</template>

<script>
export default {
  name: "Cell",
  props: {
    cell: {
      required: true,
      type: Object,
    },
  },
  emits: ["touch", "toggle-flag"],
  methods: {
    renderCell() {
      if (this.cell.isOpened() && !this.cell.isMine()) {
        return this.cell.getValue();
      }
      return null;
    },
  },
};
</script>

<style scoped>
.cell {
  font-family: "webFont", monospace;
  width: 2rem;
  height: 2rem;
  font-size: small;
  border: 1px solid rgb(196, 196, 196);
  background: rgb(150, 150, 150);
  outline: 1px ridge rgb(120, 120, 120);
  margin: 0px;
  font-size: 1.3rem;
  text-align: center;
}

.cell:active {
  outline: 1px ridge rgb(150, 150, 150);
}

.opened {
  background: rgb(191, 191, 191);
  outline: 1px outset rgb(150, 150, 150);
}

.opened[value-number="0"] {
  color: rgba(0, 0, 0, 0);
}

.opened[value-number="1"] {
  color: rgb(0, 0, 255);
}

.opened[value-number="2"] {
  color: rgb(0, 127, 0);
}

.opened[value-number="3"] {
  color: rgb(255, 0, 0);
}

.opened[value-number="4"] {
  color: rgb(0, 0, 127);
}

.opened[value-number="5"] {
  color: rgb(127, 0, 0);
}

.opened[value-number="6"] {
  color: rgb(0, 127, 127);
}

.opened[value-number="7"] {
  color: rgb(0, 0, 63);
}

.opened[value-number="8"] {
  color: rgb(0, 63, 0);
}

.value-09 {
  color: rgb(63, 0, 0);
}

.flagged {
  background-image: url(@/assets/flag.svg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
}

.mine {
  background-image: url(@/assets/mine.svg);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
}
</style>

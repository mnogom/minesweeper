<script setup>
import Cell from "./Cell.vue";
</script>

<template>
  <main class="mt-5">
    <div
      class="row row-cols-auto"
      v-for="i in field.getLevel().getHeight()"
      :key="i"
    >
      <div class="coll p-0" v-for="j in field.getLevel().getWidth()" :key="j">
        <Cell
          :cell="
            field.getCellByAddress(
              j - 1 + (i - 1) * field.getLevel().getWidth()
            )
          "
          @touch="field = field.touch($event)"
          @toggle-flag="field = field.toggleFlag($event)"
        />
      </div>
    </div>
    <div>{{ field.getStatus() }}</div>
    <div>
      {{
        level.getMines() -
        field.getCells().filter((cell) => cell.isFlagged()).length
      }}
    </div>
  </main>
</template>

<script>
import Field from "./utils/game/field";

export default {
  name: "Field",
  props: { level: { required: true } },
  emits: ["switch-game-status"],
  data() {
    return {
      field: Object,
      gemeStatus: "not started",
    };
  },

  created() {
    this.field = this.getNewField(this.level);
  },

  methods: {
    getNewField(level) {
      return new Field(level);
    },
    openCell(cell) {
      if (cell.isMine()) {
        this.gameStatus = "loose";
        return this.field.showMines();
      }
      return this.field.touch(cell);
    },
  },
};
</script>

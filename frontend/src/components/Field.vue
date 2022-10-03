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
    <div @click="field = new Field(level)">
      status: {{ field.getStatus() }}
    </div>
    <div>
      Mines estimate: {{
        field.getLevel().getMines() -
        field.getCells().filter((cell) => cell.isFlagged()).length
      }}
    </div>
    <div>Timer: {{ time }}</div>
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
      time: 0,
    };
  },

  created() {
    this.field = new Field(this.level);
  },
};
</script>

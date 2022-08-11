<template>
  <div class="position-initial">
    <div
      class="card position-absolute top-50 start-50 translate-middle p-2 shadow-lg"
      style="width: 26rem"
    >
      <div class="card-body">
        <h5 class="card-title mb-3">Settings</h5>

        <!-- Difficulty selector -->
        <select
          class="form-select mb-3"
          id="difficulty-input"
          aria-label="Difficulty chooser"
          @change="currentLevel = setName($event.target.value)"
        >
          <option
            v-for="(defaultLevelName, index) in levels"
            :key="index"
            :value="defaultLevelName"
            :selected="defaultLevelName === currentLevel.getName()"
          >
            {{ defaultLevelName }}
          </option>
        </select>

        <!-- Game settings -->
        <div class="row">
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                id="width-input"
                :value="currentLevel.getWidth()"
                :disabled="currentLevel.isStandartType()"
                @input="currentLevel = setWidth($event.target.value)"
              />
              <label for="width-input">Width</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                id="height-input"
                :value="currentLevel.getHeight()"
                :disabled="currentLevel.isStandartType()"
                @input="currentLevel = setHeight($event.target.value)"
              />
              <label for="height-input">Height</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                id="count-input"
                :value="currentLevel.getMines()"
                :disabled="currentLevel.isStandartType()"
                @input="currentLevel = setMines($event.target.value)"
              />
              <label for="count-input">Mines</label>
            </div>
          </div>
        </div>

        <div class="text-end">
          <div class="btn-group" role="group" aria-label="Controls">
            <button class="btn btn btn-outline-secondary" @click="$emit('return', currentLevel)">
              Apply
            </button>
            <button class="btn btn btn-outline-secondary" @click="$emit('return', initLevelFromProps())">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Level from "./utils/levels/level.js";
import { getAllLevels } from "./utils/levels/defaultLevels.js";

export default {
  name: "Settings",
  
  props: {
    levelName: { type: String, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    mines: { type: Number, default: null },
  },

  emits: [
    "return",
  ],

  data() {
    return {
      levels: getAllLevels(),
      currentLevel: null,
    };
  },

  created() {
    this.currentLevel = this.initLevelFromProps();
  },

  methods: {
    setName(levelName) {
      return this.currentLevel.setName(levelName);
    },
    setWidth(width) {
      return this.currentLevel.setWidth(width);
    },
    setHeight(height) {
      return this.currentLevel.seteight(height);
    },
    setMines(mines) {
      return this.currentLevel.setMines(mines);
    },
    initLevelFromProps() {
      return new Level(this.levelName, this.width, this.height, this.mines)
    }
  },
};
</script>

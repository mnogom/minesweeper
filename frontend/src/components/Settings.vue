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
          @change="updatedLevel = setName($event.target.value)"
        >
          <option
            v-for="(defaultLevelName, index) in levels"
            :key="index"
            :value="defaultLevelName"
            :selected="defaultLevelName === updatedLevel.getName()"
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
                :value="updatedLevel.getWidth()"
                :disabled="updatedLevel.isStandartType()"
                @input="updatedLevel = setWidth($event.target.value)"
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
                :value="updatedLevel.getHeight()"
                :disabled="updatedLevel.isStandartType()"
                @input="updatedLevel = setHeight($event.target.value)"
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
                :value="updatedLevel.getMines()"
                :disabled="updatedLevel.isStandartType()"
                @input="updatedLevel = setMines($event.target.value)"
              />
              <label for="count-input">Mines</label>
            </div>
          </div>
        </div>

        <div class="text-end">
          <div class="btn-group" role="group" aria-label="Controls">
            <button class="btn btn btn-outline-secondary" @click="$emit('return', updatedLevel)">
              Apply
            </button>
            <button class="btn btn btn-outline-secondary" @click="$emit('return', level)">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllLevels } from "./utils/levels/defaultLevels.js";

export default {
  name: "Settings",
  
  props: {
    level: { required: true },
  },

  emits: [
    "return",
  ],

  data() {
    return {
      levels: getAllLevels(),
      updatedLevel: null,
    };
  },

  created() {
    this.updatedLevel = this.level;
  },

  methods: {
    setName(levelName) {
      return this.updatedLevel.setName(levelName);
    },
    setWidth(width) {
      return this.updatedLevel.setWidth(width);
    },
    setHeight(height) {
      return this.updatedLevel.seteight(height);
    },
    setMines(mines) {
      return this.updatedLevel.setMines(mines);
    },
  },
};
</script>

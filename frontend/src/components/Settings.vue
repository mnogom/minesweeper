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
          :class="{ 'is-invalid': !(isValidName) }"
          id="difficulty-input"
          aria-label="Difficulty chooser"
          @change="setName($event.target.value)"
        >
          <option
            v-for="(defaultLevelName, index) in levelNames"
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
                :class="{ 'is-invalid': !(isValidWidth) }"
                id="width-input"
                :value="updatedLevel.getWidth()"
                :disabled="updatedLevel.isStandartType()"
                @input="setWidth(Number($event.target.value))"
              />
              <label for="width-input">Width</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                :class="{ 'is-invalid': !(isValidHeight) }"
                id="height-input"
                :value="updatedLevel.getHeight()"
                :disabled="updatedLevel.isStandartType()"
                @input="setHeight(Number($event.target.value))"
              />
              <label for="height-input">Height</label>
            </div>
          </div>
          <div class="col">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control"
                :class="{ 'is-invalid': !(isValidMines) }"
                id="count-input"
                :value="updatedLevel.getMines()"
                :disabled="updatedLevel.isStandartType()"
                @input="setMines(Number($event.target.value))"
              />
              <label for="count-input">Mines</label>
            </div>
          </div>
        </div>

        <div class="text-end">
          <div class="btn-group" role="group" aria-label="Controls">
            <button
              class="btn btn btn-outline-secondary"
              :disabled="!(isValidSettings())"
              @click="$emit('return', getUpdatedLevel())"
            >
              Apply
            </button>
            <button class="btn btn btn-outline-secondary" @click="$emit('return', initialLevel)">
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
import { getDefaultNames } from "./utils/levels/default-levels.js";
import {
  validateWidth, validateHeight, validateMines, validateName
} from "./utils/levels/validators.js";

export default {
  name: "Settings",
  
  props: {
    initialLevel: { required: true },
  },

  emits: [
    "return",
  ],

  data() {
    return {
      levelNames: getDefaultNames(),
      updatedLevel: null,
      isValidWidth: true,
      isValidHeight: true,
      isValidMines: true,
      isValidName: true,
    };
  },

  created() {
    this.updatedLevel = this.initialLevel;
  },

  methods: {
    setName(levelName) {
      validateName(levelName)
        .then((isValid) => {
          this.isValidName = isValid;
          this.updatedLevel = this.updatedLevel.setName(levelName);
        })
    },
    
    setWidth(width) {
      validateWidth(width)
        .then((isValid) => {
          this.isValidWidth = isValid;
          this.updatedLevel = this.updatedLevel.setWidth(width);
        });
    },
    
    setHeight(height) {
      validateHeight(height)
        .then((isValid) => {
          this.isValidHeight = isValid;
          this.updatedLevel = this.updatedLevel.setHeight(height);
        });
    },
    
    setMines(mines) {
      const width = this.updatedLevel.getWidth();
      const height = this.updatedLevel.getHeight();
      validateMines(width, height, mines)
        .then((isValid) => {
          this.isValidMines = isValid;
          this.updatedLevel = this.updatedLevel.setMines(mines);
        })
    },
    
    isValidSettings() {
      return this.isValidName && this.isValidWidth && this.isValidHeight && this.isValidMines
    },
    
    getUpdatedLevel() {
      const level = this.isValidSettings() ? this.updatedLevel : this.initialLevel;
      if (level.isStandartType()) {
        return level;
      }
      for (const levelName of this.levelNames) {
        if (levelName !== level.getName()) {
          const defaultLevel = new Level(levelName)
          if (level.isEqual(defaultLevel)) {
            return defaultLevel;
          }
        }
        return level;
      }
    }
  },
};
</script>

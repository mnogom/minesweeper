<template>
<div class="position-initial">
  <div class="card position-absolute top-50 start-50 translate-middle p-2 shadow-lg" style="width: 26rem;">
    <div class="card-body">
      <h5 class="card-title mb-3">Settings</h5>
      <!-- Difficulty selector -->
      <select class="form-select mb-3"
              id="difficulty-input"
              aria-label="Difficulty chooser"
              @change="setDifficulty($event)">
        <option v-for="(_, difficulty) in difficulties"
                :key="difficulty"
                :value="difficulty"
                :selected="difficulty === curDifficulty">
          {{ difficulty }}
        </option>
      </select>
      <!-- Game parameters -->
      <div class="row">
        <div class="col">
          <div class="form-floating mb-3">
            <input type="number" class="form-control" id="width-input" :value="getWidth()" :disabled="curDifficulty !== 'Architect'">
            <label for="width-input">Width</label>
          </div>
        </div>
        <div class="col">
          <div class="form-floating mb-3">
            <input type="number" class="form-control" id="height-input" :value="getHeight()" :disabled="curDifficulty !== 'Architect'">
            <label for="height-input">Height</label>
          </div>
        </div>
        <div class="col">
          <div class="form-floating mb-3">
            <input type="number" class="form-control" id="count-input" :value="getMines()" :disabled="curDifficulty !== 'Architect'">
            <label for="count-input">Mines</label>
          </div>
        </div>
      </div>

      <div class="text-end">
        <div class="btn-group" role="group" aria-label="Controls">
          <button class="btn btn btn-outline-secondary" @click="setWidth()">Apply</button>
          <button class="btn btn btn-outline-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "InputParams",
  props: {
    curDifficulty: String,
    width: Number,
    height: Number,
    mines: Number,
  },
  data() {
    return {
      difficulties: {
        Junior: { width: 8, height: 8, mines: 10 },
        Middle: { width: 16, height: 16, mines: 40 },
        Senior: { width: 30, height: 16, mines: 99 },
        Architect: { width: null, height: null, mines: null },
      },
    }
  },
  methods: {
    getWidth() {
      return this.curDifficulty === "Architect" ? this.width : this.difficulties[this.curDifficulty].width;
    },
    getHeight() {
      return this.curDifficulty === "Architect" ? this.height : this.difficulties[this.curDifficulty].height;
    },
    getMines() {
      return this.curDifficulty === "Architect" ? this.mines : this.difficulties[this.curDifficulty].mines;
    },

    setDifficulty(event) {
      // this.curDifficulty = event.target.value;
      // this.currentWidth = this.difficulties[this.curDifficulty].width;
      // this.currentHeight = this.difficulties[this.curDifficulty].height;
      // this.currentMines = this.difficulties[this.curDifficulty].mines;
    },
    setWidth() {
      return this.currentWidth;
    }
  }

};
</script>
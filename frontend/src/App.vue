<script setup>
import Field from "./components/Field.vue";
import Settings from "./components/Settings.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />

    <button class="btn btn-primary" @click="openSettings()">
      Settings
    </button>

    <div class="flex-grow-1">
      <div class="container">
        <Settings
          v-if="settingsVisible"
          :level-name="level.getName()"
          :width="level.getWidth()"
          :height="level.getHeight()"
          :mines="level.getMines()"
          @return="applySettings($event); closeSettings()"
        />
        <Field />
      </div>
    </div>

    {{ level }}

    <Footer />
  </div>
</template>

<script>
import Level from "./components/utils/levels/level.js"

export default {
  data() {
    return {
      settingsVisible: false,
      level: new Level('Junior'),
    }
  },
  methods: {
    openSettings() {
      this.settingsVisible = true;
    },
    applySettings(level) {
      this.level = level;
    },
    closeSettings() {
      this.settingsVisible = false;
    }
  },
}
</script>

<style scoped></style>

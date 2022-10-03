<script setup>
import Field from "./components/Field.vue";
import Settings from "./components/Settings.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />

    <div class="flex-grow-1 align-self-center">
      <div class="container">
        <div class="btn-group">
          <button class="btn btn-outline-primary mt-3" @click="openSettings()">
            Settings
          </button>
          <button class="btn btn-outline-primary mt-3" @click="restartGame()">
            Restart
          </button>
        </div>

        <Settings
          v-if="settingsVisible"
          :initial-level="level"
          @return="
            applySettings($event);
            closeSettings();
          "
        />
        <Field v-if="!settingsVisible" :level="level" />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Level from "./components/utils/levels/level.js";

export default {
  data() {
    return {
      settingsVisible: false,
      level: new Level("Junior"),
    };
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
    },
  },
};
</script>

<style scoped></style>

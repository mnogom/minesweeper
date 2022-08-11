<script setup>
import MinesweeperField from "./components/MinesweeperField.vue";
import InputParams from "./components/InputParams.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />

    <div class="flex-grow-1">
      <div class="container">
        <InputParams :cur-difficulty="'Senior'"
                     :width="4"
                     :height="5"
                     :mines="2" />
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped></style>

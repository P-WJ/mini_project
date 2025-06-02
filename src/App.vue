<template>
  <!-- <Map /> -->
  <div
    :style="{ backgroundColor: themeStore.color }"
    class="min-h-screen transition-all"
  >
    <router-view />
    <Modal />
  </div>
</template>

<script setup>
import Map from "./map/components/Map.vue";

import Modal from "./components/base/Modal.vue";
import { useThemeStore } from "./components/store/theme";

const themeStore = useThemeStore();
</script>

<template>
  <div :class="theme" class="wrapper">
    <!-- Navbar -->
    <Navbar 
      :theme="theme"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      @update-theme="theme = $event"
    />

    <div class="layout">
      <!-- Sidebar -->
      <Sidebar :isOpen="isSidebarOpen" />

      <!-- Main content -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';

const isSidebarOpen = ref(true);
const theme = ref(localStorage.getItem("theme") || "light");

watch(theme, (newTheme) => {
  localStorage.setItem("theme", newTheme);
});
</script>

<style scoped>
/* Push everything down to avoid navbar overlap */
.wrapper {
  padding-top: 64px;     /* same height as navbar */
}

.layout {
  display: flex;
}

/* Sidebar must be above main content */
.sidebar {
  z-index: 30 !important;
  position: relative;
}

.content {
  flex: 1;
  padding: 20px;
  height: calc(100vh - 64px);
}
</style>

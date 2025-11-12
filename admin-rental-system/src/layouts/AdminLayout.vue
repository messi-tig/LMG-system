<template>
  <div :class="theme">
    <!-- Navbar -->
    <Navbar :theme="theme" @update-theme="theme = $event" />

    <div class="layout-body">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="layout-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const theme = ref(localStorage.getItem('theme') || 'light')

watch(theme, (newTheme) => {
  document.documentElement.className = newTheme
  localStorage.setItem('theme', newTheme)
})

onMounted(() => {
  document.documentElement.className = theme.value
})
</script>

<style scoped>
.layout-body {
  display: flex;
  min-height: calc(100vh - 64px); /* Navbar height */
}
.layout-main {
  flex: 1;
  padding: 2rem;
  background-color: #f9fafb;
  transition: background-color 0.3s;
}
.dark .layout-main {
  background-color: #1f2937;
  color: #f9fafb;
}
</style>

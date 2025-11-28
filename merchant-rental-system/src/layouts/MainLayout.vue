<template>
  <div :class="['main-layout', theme]">
    <!-- Navbar -->
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="layout-body">
      <!-- Sidebar -->
      <Sidebar :open="sidebarOpen" />

      <!-- Overlay for mobile -->
      <div 
        v-if="isMobile && sidebarOpen" 
        class="overlay" 
        @click="sidebarOpen = false">
      </div>

      <!-- Main content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';

const theme = ref('light');
const sidebarOpen = ref(true);
const isMobile = ref(window.innerWidth <= 768);
const { locale } = useI18n();

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) sidebarOpen.value = true; // auto open on desktop
}

onMounted(() => {
  // Initialize theme
  theme.value = localStorage.getItem('theme') || 'light';
  document.documentElement.className = theme.value;

  // Initialize language
  locale.value = localStorage.getItem('locale') || 'en';

  window.addEventListener('resize', handleResize);
});

watch(theme, (newTheme) => {
  document.documentElement.className = newTheme;
  localStorage.setItem('theme', newTheme);
});
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.layout-body {
  display: flex;
  flex: 1;
  position: relative;
  min-height: calc(100vh - 60px);
  background-color: #f8fafc;
  transition: background-color 0.3s;
}

.dark .layout-body {
  background-color: #111827;
  color: white;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Mobile overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 40;
  transition: opacity 0.3s ease;
}

/* Mobile padding */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>

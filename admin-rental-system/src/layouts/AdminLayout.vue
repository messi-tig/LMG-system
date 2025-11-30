<template>
  <div :class="['wrapper', theme]">
    <!-- Navbar -->
    <Navbar 
      :theme="theme"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      @update-theme="theme = $event"
    />

    <div class="layout">
      <!-- Sidebar -->
      <Sidebar :isOpen="isSidebarOpen" />

      <!-- Overlay for mobile -->
      <div 
        v-if="isMobile && isSidebarOpen" 
        class="overlay" 
        @click="isSidebarOpen = false">
      </div>

      <!-- Main content -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';

const isSidebarOpen = ref(true);
const theme = ref(localStorage.getItem("theme") || "light");
const isMobile = ref(window.innerWidth <= 768);

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) isSidebarOpen.value = true; // auto open sidebar on desktop
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

watch(theme, (newTheme) => {
  localStorage.setItem("theme", newTheme);
});
</script>

<style scoped>
/* Wrapper padding for navbar */
.wrapper {
  padding-top: 64px;
}

/* Layout flex */
.layout {
  display: flex;
  position: relative;
}

/* Sidebar */
.sidebar {
  z-index: 45; /* above main content */
  position: relative;
  transition: transform 0.3s ease;
}

/* Sidebar mobile behavior */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 220px;
    transform: translateX(-100%);
    background: #fff;
    z-index: 45;
    box-shadow: 2px 0 12px rgba(0,0,0,0.2);
  }
  .sidebar[isOpen] {
    transform: translateX(0);
  }
}

/* Main content */
.content {
  flex: 1;
  padding: 20px;
  height: calc(100vh - 64px);
  transition: filter 0.3s;
}

/* Dim main content when sidebar open on mobile */
@media (max-width: 768px) {
  .content {
    flex: 1;
  }
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 40; /* below sidebar but above main content */
}

/* Ensure navbar stays on top */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50; /* highest */
}

/* Content scroll */
.content {
  overflow-y: auto;
}
</style>

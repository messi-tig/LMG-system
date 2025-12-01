<template>
  <aside :class="['sidebar', { 'sidebar-closed': !isOpen, mobile: isMobile, 'sidebar-open': isOpen }]">
    
    <div class="sidebar-header">
      <h2>{{ $t('dashboard.title') }}</h2>
      <button v-if="isMobile" class="close-btn" @click="$emit('toggle-sidebar')">✕</button>
    </div>

    <!-- Scrollable menu -->
    <nav class="menu">
      <router-link to="/dashboard" class="menu-item">
        <span class="icon">🏠</span>
        <span>{{ $t('dashboard.title') }}</span>
      </router-link>

      <router-link to="/merchant-list" class="menu-item">
        <span class="icon">📦</span>
        <span>{{ $t('merchantList.title') }}</span>
      </router-link>

      <router-link to="/customer-list" class="menu-item">
        <span class="icon">👥</span>
        <span>{{ $t('customer.listTitle') }}</span>
      </router-link>

      <router-link to="/booking-list" class="menu-item">
        <span class="icon">📅</span>
        <span>{{ $t('bookingList.title') }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: true }
});

const isMobile = ref(window.innerWidth <= 768);

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>

<style scoped>
/* FIXED SIDEBAR */
.sidebar {
  width: 220px;
  background: white;
  padding: 1rem;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  position: fixed;
  top: 64px; /* Below navbar */
  left: 0;
  height: calc(100vh - 64px);
  overflow: hidden; /* Prevent scrolling */
  transition: transform 0.3s ease;
  z-index: 60;
}

/* Sidebar content scrolls here */
.menu {
  margin-top: 1rem;
  overflow-y: auto;
  height: calc(100% - 60px);
  padding-right: 4px;
}

/* DESKTOP CLOSED */
.sidebar-closed {
  transform: translateX(-100%);
}

/* MOBILE MODE */
.mobile {
  width: 70%;
  max-width: 260px;
  border-radius: 0;
  top: 0;
  height: 100vh;
  padding-top: 70px;
  transform: translateX(-100%);
}

.mobile.sidebar-open { transform: translateX(0); }
.mobile.sidebar-closed { transform: translateX(-100%); }

/* Menu Styling */
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: 0.2s;
}

.menu-item:hover,
.menu-item.router-link-active {
  background: #7184b7;
  color: white;
}
</style>

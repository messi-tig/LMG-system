<template>
  <aside :class="['sidebar', { 'sidebar-closed': !open, 'mobile': isMobile }]">
    <ul>
      <li><router-link to="/dashboard" active-class="active">🏠 Home</router-link></li>
      <li><router-link to="/properties" active-class="active">🏢 Properties</router-link></li>
      <li><router-link to="/properties/add" active-class="active">➕ Add Property</router-link></li>
      <li><router-link to="/bookings" active-class="active">📖 Bookings</router-link></li>
    </ul>
  </aside>
</template>

<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: true }
});

const isMobile = ref(window.innerWidth <= 768);

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  min-height: 100vh;
  transition: all 0.3s ease;
  position: relative;
  z-index: 30;
}

/* Sidebar closed */
.sidebar-closed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

/* Mobile slide-in sidebar */
.mobile {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 50;
  border-radius: 0;
}

.mobile.sidebar-closed {
  transform: translateX(-100%);
}

.mobile:not(.sidebar-closed) {
  transform: translateX(0);
}

/* Menu list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin-bottom: 1rem;
}
a {
  text-decoration: none;
  color: #6b79a0;
  display: block;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  transition: 0.2s;
}
a.active, a:hover {
  background-color: #7184b7;
  color: white;
}

/* Mobile tweaks */
@media (max-width: 768px) {
  .sidebar {
    width: 220px;
    padding: 1rem;
    box-shadow: 0 0 12px rgba(0,0,0,0.2);
  }
  li {
    margin-bottom: 1rem;
  }
  a {
    font-size: 1rem;
    padding: 0.7rem 1rem;
  }
}
</style>

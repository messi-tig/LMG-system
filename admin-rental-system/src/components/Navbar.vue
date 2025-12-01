<template>
  <header class="navbar">
    <!-- Sidebar toggle -->
    <button class="hamburger-btn" @click="$emit('toggle-sidebar')">☰</button>

    <!-- Logo -->
    <h1 class="logo">{{ $t('dashboard.title') }}</h1>

    <!-- Controls -->
    <div class="controls" ref="dropdownRef">
      <button class="dropdown-btn" @click.stop="dropdownOpen = !dropdownOpen">⋮</button>

      <div v-if="dropdownOpen" class="dropdown-menu">
        <div class="dropdown-item">
          <label>Language:</label>
          <select v-model="locale" @change="onLocaleChange">
            <option value="en">EN</option>
            <option value="am">AM</option>
            <option value="om">OM</option>
          </select>
        </div>
        <div class="dropdown-item">
          <label>Theme:</label>
          <select v-model="theme" @change="onThemeChange">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button class="logout-btn" @click="handleLogout">{{ $t('actions.logout') }}</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['toggle-sidebar']);
const router = useRouter();
const { locale } = useI18n();
const theme = ref(localStorage.getItem('theme') || 'light');
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

function handleLogout() {
  localStorage.removeItem('adminToken'); // or merchantToken if using merchant
  router.replace('/login');
}

function onLocaleChange() {
  localStorage.setItem('locale', locale.value);
}

function onThemeChange() {
  document.documentElement.className = theme.value;
  localStorage.setItem('theme', theme.value);
}
</script>
<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 60px;

  background-color: #1e40af;
  color: white;

  padding: 0 1rem;
  box-sizing: border-box;

  position: fixed;
  top: 0;
  left: 0;

  z-index: 100;

  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  overflow: hidden; /* 🚫 Prevent any scrolling */
}

/* Hamburger */
.hamburger-btn {
  font-size: 1.6rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* Logo text */
.logo {
  flex: 1;
  text-align: center;

  font-weight: 700;
  font-size: 1.4rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Controls wrapper */
.controls {
  position: relative;
  display: flex;
  align-items: center;
}

/* 3-dot button */
.dropdown-btn {
  background: #4b5563;
  color: white;
  padding: 0.4rem 0.55rem;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dropdown-btn:hover {
  background: #1d4ed8;
}

/* Dropdown menu */
:deep(.dropdown-menu) {
  position: absolute;
  top: 110%;
  right: 0; /* ⭐ PERFECT POSITION for all screens */

  background: white;
  color: #1f2937;

  padding: 0.75rem;
  min-width: 200px;

  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  z-index: 200;
}

/* Dropdown items */
.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item select {
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

/* Logout button */
.logout-btn {
  width: 100%;
  padding: 0.45rem;

  background-color: #10b981;
  border: none;
  color: white;

  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  transition: background 0.2s;
}
.logout-btn:hover {
  background-color: #059669;
}

/* 📱 Mobile Optimization */
@media (max-width: 768px) {
  .navbar {
    height: 55px;
    padding: 0 0.7rem;
  }

  .logo {
    font-size: 1.1rem;
    text-align: left;
    margin-left: 0.5rem;
  }

  :deep(.dropdown-menu) {
    right: -10px; /* ⭐ Keeps dropdown inside screen ALWAYS */
    min-width: 170px;
    padding: 0.5rem;
  }

  .dropdown-btn {
    font-size: 1.15rem;
    padding: 0.32rem 0.55rem;
  }

  .logout-btn {
    font-size: 0.85rem;
    padding: 0.4rem;
  }
}

</style>

<template>
  <header class="navbar">
    <!-- Sidebar toggle -->
    <button class="hamburger-btn" @click="$emit('toggle-sidebar')" aria-label="Toggle Sidebar">☰</button>

    <!-- Logo -->
    <h1 class="logo">Welcome to LMG Tech</h1>

    <!-- Controls -->
    <div class="controls" ref="dropdownRef">
      <button class="dropdown-btn" @click.stop="dropdownOpen = !dropdownOpen" aria-label="Open Menu">
        <img
          v-if="merchant.profilePicture"
          :src="profileImageUrl"
          class="profile-dropdown-image"
          alt="Profile"
        />
        <span v-else class="default-avatar">👤</span>
      </button>

      <div v-if="dropdownOpen" class="dropdown-menu">
        <!-- Language selector -->
        <div class="dropdown-item">
          <label>Language:</label>
          <select v-model="locale" @change="onLocaleChange">
            <option value="en">EN</option>
            <option value="am">AM</option>
            <option value="om">OM</option>
          </select>
        </div>

        <!-- Theme selector -->
        <div class="dropdown-item">
          <label>Theme:</label>
          <select v-model="theme" @change="onThemeChange">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <!-- Profile link -->
        <div class="dropdown-item">
          <router-link to="/profile" class="profile-link" active-class="active">Profile</router-link>
        </div>

        <!-- Logout button -->
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { merchantStore } from '@/store/merchantStore';

const emit = defineEmits(['toggle-sidebar']);
const router = useRouter();
const { locale } = useI18n();
const theme = ref(localStorage.getItem('theme') || 'light');
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

// Reactive merchant profile
const merchant = merchantStore;

// Build profile image URL
const profileImageUrl = computed(() => {
  return merchant.profilePicture
    ? `https://lmgtech-4.onrender.com/uploads/${merchant.profilePicture}`
    : '';
});

onMounted(() => {
  // Apply saved theme
  document.documentElement.className = theme.value;

  // Close dropdown when clicking outside
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

function handleLogout() {
  localStorage.removeItem('merchantToken');
  localStorage.removeItem('merchant');
  router.replace('/login');
}

function onLocaleChange() {
  localStorage.setItem('lang', locale.value);
}

function onThemeChange() {
  document.documentElement.className = theme.value;
  localStorage.setItem('theme', theme.value);
}

// Watch for profile updates to automatically update dropdown image
watch(
  () => merchant.profilePicture,
  (newPic) => {
    // Reactive update handled by computed property
  }
);
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1e40af;
  color: white;
  padding: 0.6rem 1rem;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  border-radius: 0 0 10px 10px;
}

.hamburger-btn {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.logo {
  flex: 1;
  text-align: center;
  font-weight: 700;
  font-size: 1.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  position: relative;
}

.dropdown-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
}

.profile-dropdown-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.default-avatar {
  font-size: 1.3rem;
  color: white;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 120%;
  background: white;
  color: #1f2937;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 220px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.dropdown-item select {
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 0.85rem;
}

.profile-link {
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  width: 100%;
  display: block;
  padding: 0.25rem 0;
  transition: background 0.2s;
}

.profile-link:hover {
  background-color: #f3f4f6;
  border-radius: 6px;
}

.logout-btn {
  width: 100%;
  background-color: #10b981;
  border: none;
  color: white;
  padding: 0.45rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}
.logout-btn:hover {
  background-color: #059669;
}

@media (max-width: 768px) {
  .logo { font-size: 1.2rem; text-align: left; }
  .dropdown-menu { min-width: 180px; padding: 0.5rem; }
  .dropdown-item select { font-size: 0.8rem; }
  .logout-btn { font-size: 0.85rem; padding: 0.35rem; }
}
</style>

<template>
  <header class="navbar">
    <button class="hamburger-btn" @click="$emit('toggle-sidebar')">☰</button>
    <h1 class="logo">Welcome to LMG Tech</h1>

    <div class="controls" ref="dropdownRef">
      <!-- Profile avatar in navbar -->
      <button class="dropdown-btn" @click.stop="dropdownOpen = !dropdownOpen">
        <img
          v-if="merchant.profilePictureUrl"
          :src="merchant.profilePictureUrl"
          class="profile-dropdown-image"
          alt="Profile"
        />
        <span v-else class="default-avatar">👤</span>
      </button>

      <!-- Dropdown menu -->
      <div v-if="dropdownOpen" class="dropdown-menu">
        <!-- Top image preview -->
        <div class="dropdown-image-preview">
          <img
            v-if="merchant.profilePictureUrl"
            :src="merchant.profilePictureUrl"
            class="dropdown-image"
            alt="Profile Preview"
          />
          <span v-else class="default-avatar-dropdown">👤</span>
        </div>

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

        <div class="dropdown-item">
          <router-link to="/profile" class="profile-link">Profile</router-link>
        </div>

        <button class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { merchantStore } from '@/store/merchantStore';

const emit = defineEmits(['toggle-sidebar']);
const router = useRouter();
const { locale } = useI18n();
const theme = ref(localStorage.getItem('theme') || 'light');
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const merchant = merchantStore;

onMounted(() => {
  document.documentElement.className = theme.value;
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

// Watch for profile image changes
watch(() => merchant.profilePictureUrl, () => {});
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1e40af;
  color: white;
  padding: 0.6rem 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  border-radius: 0 0 10px 10px;
}

.hamburger-btn { font-size: 1.5rem; background: none; border: none; color: white; cursor: pointer; }

.logo { flex: 1; text-align: center; font-weight: 700; font-size: 1.6rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.controls { position: relative; }

.dropdown-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: #2563eb; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0;
}

.profile-dropdown-image { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

.default-avatar { font-size: 1.3rem; color: white; }

.dropdown-menu {
  position: absolute; right: 0; top: 120%;
  background: white; color: #1f2937;
  border-radius: 10px; padding: 0.75rem 1rem;
  min-width: 220px; display: flex; flex-direction: column; gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 60;
}

.dropdown-image-preview {
  display: flex; justify-content: center; margin-bottom: 0.5rem;
}

.dropdown-image {
  width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #4caf50;
}

.default-avatar-dropdown { font-size: 2rem; }

.dropdown-item { display: flex; justify-content: space-between; align-items: center; }

.dropdown-item select { padding: 0.3rem 0.5rem; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; }

.profile-link { text-decoration: none; color: #1f2937; font-weight: 500; width: 100%; display: block; padding: 0.25rem 0; transition: background 0.2s; }
.profile-link:hover { background-color: #f3f4f6; border-radius: 6px; }

.logout-btn { width: 100%; background-color: #10b981; border: none; color: white; padding: 0.45rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.logout-btn:hover { background-color: #059669; }
</style>

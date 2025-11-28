<template>
  <nav class="navbar">
    <!-- Hamburger -->
    <button class="hamburger" @click="$emit('toggle-sidebar')">☰</button>

    <!-- Center title -->
    <h1 class="title">{{ $t('dashboard.title') }}</h1>

    <!-- Right menu -->
    <div class="menu-wrapper">
      <button class="menu-btn" @click="menuOpen = !menuOpen">⋮</button>

      <div v-if="menuOpen" class="dropdown">
        <LanguageSwitcher />

        <ThemeSwitcher 
          :theme="theme" 
          @update-theme="$emit('update-theme', $event)" 
        />

        <button @click="logout" class="logout-btn">{{ $t('actions.logout') }}</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LanguageSwitcher from './LanguageSelector.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

const props = defineProps({ theme: String });
defineEmits(['toggle-sidebar', 'update-theme']);

const router = useRouter();
const menuOpen = ref(false);

function logout() {
  localStorage.removeItem('adminToken');
  router.push('/login');
}
</script>

<style scoped>
.navbar {
  height: 54px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  position: relative;
  border-bottom: 1px solid #d0d7ff;
}

.hamburger {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  flex: 1;
  margin: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-wrapper {
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 40px;
  background: white;
  width: 160px;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 50;
}

.logout-btn {
  width: 100%;
  background: #f5f5f5;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* MOBILE STYLING */
@media (max-width: 640px) {
  .navbar {
    padding: 0 10px;
  }
  .title {
    font-size: 1rem;
  }
  .hamburger {
    font-size: 22px;
  }
  .menu-btn {
    font-size: 20px;
  }
  .dropdown {
    width: 140px;
    top: 36px;
    padding: 8px;
  }
  .logout-btn {
    font-size: 0.85rem;
  }
}
</style>

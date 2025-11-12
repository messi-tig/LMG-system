<template>
  <div :class="['main-layout', theme]">
    <!-- Navbar -->
    <header class="main-header">
      <div class="header-left">
        <h1>LMG Tech</h1>
      </div>
      <div class="header-right">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <button class="logout-btn" @click="logout">{{ $t('navbar.logout') }}</button>
      </div>
    </header>

    <!-- Body -->
    <div class="layout-body">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Sidebar from '@/components/Sidebar.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

const router = useRouter()
const theme = ref('light')
const { locale } = useI18n()

onMounted(() => {
  // Initialize theme
  theme.value = localStorage.getItem('theme') || 'light'
  document.documentElement.className = theme.value

  // Initialize language
  locale.value = localStorage.getItem('locale') || 'en'
})

function logout() {
  localStorage.removeItem('merchantToken')
  localStorage.removeItem('merchant')
  router.push('/login')
}
</script>

<style scoped>
.main-layout { display: flex; flex-direction: column; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #5d6b91;
  color: white;
}
.layout-body { display: flex; flex: 1; min-height: calc(100vh - 64px); }
.main-content { flex: 1; padding: 2rem; background-color: #f8fafc; transition: background-color 0.3s; }
.dark .main-header { background-color: #1e40af; }
.dark .main-content { background-color: #111827; color: white; }
.logout-btn {
  background-color: #10b981;
  border: none;
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
</style>

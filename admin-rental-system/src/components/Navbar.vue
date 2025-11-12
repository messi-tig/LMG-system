<template>
  <nav class="navbar">
    <div class="left">well come to lmg tech</div>

    <div class="right">
      <LanguageSwitcher />
      <ThemeSwitcher :theme="theme" @update-theme="$emit('update-theme', $event)" />
      <button @click="logout" class="logout-btn">
        🔒 {{ $t('logout') }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import LanguageSwitcher from './LanguageSelector.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import { useRouter } from 'vue-router'

const props = defineProps({ theme: String })
const emit = defineEmits(['update-theme'])
const router = useRouter()

function logout() {
  localStorage.removeItem('adminToken')
  sessionStorage.removeItem('adminToken')
  router.push('/login')
  window.location.reload()
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #6e8bdc;
  color: white;
  font-style: italic;
}
.left{
  align-items: center;
  margin-left: 30px;
}

.right {
  display: flex;
  gap: 1rem;
}

.logout-btn {
  background-color: #ef4444;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.logout-btn:hover { background-color: #dc2626; }
</style>

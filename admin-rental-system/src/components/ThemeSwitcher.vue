<template>
  <button @click="toggleTheme" class="theme-btn">
    <span v-if="theme === 'light'">🌙 {{ $t('dark') }}</span>
    <span v-else>☀️ {{ $t('light') }}</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive theme state
const theme = ref('light')

// Initialize theme from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  theme.value = savedTheme || 'light'
  document.body.className = theme.value
})

// Toggle theme
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
  document.body.className = theme.value
}
</script>

<style scoped>
.theme-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #10b981;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.theme-btn:hover {
  background-color: #059669;
}

.theme-btn:active {
  transform: translateY(1px);
}
</style>

<template>
  <button class="theme-toggle" @click="toggleTheme">
    {{ theme === 'light' ? '🌞' : '🌙' }}
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const theme = ref('light')

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'light'
  theme.value = saved
  document.documentElement.className = saved
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.className = theme.value
  localStorage.setItem('theme', theme.value)
}
</script>

<style scoped>
.theme-toggle {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>

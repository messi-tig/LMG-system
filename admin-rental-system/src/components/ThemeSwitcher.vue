<template>
  <button @click="toggleTheme" class="theme-btn">
    {{ currentTheme === 'light' ? '🌞' : '🌙' }}
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ theme: String })
const emit = defineEmits(['update-theme'])

const currentTheme = ref(props.theme)

watch(() => props.theme, (val) => currentTheme.value = val)

function toggleTheme() {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  emit('update-theme', newTheme)
}
</script>

<style>
.theme-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>

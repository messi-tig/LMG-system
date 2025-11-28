<template>
  <div class="settings-page">
    <h1>Settings</h1>
    <p>Manage your account and application settings here.</p>

    <div class="theme-selection">
      <label>
        <input type="radio" v-model="theme" value="light" /> Light
      </label>
      <label>
        <input type="radio" v-model="theme" value="dark" /> Dark
      </label>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'Settings',
  setup() {
    const theme = ref(localStorage.getItem('theme') || 'light')

    watch(theme, (newTheme) => {
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }, { immediate: true })

    return { theme }
  }
}
</script>

<style scoped>
.settings-page {
  padding: 2rem;
}

.theme-selection {
  margin-top: 1rem;
}

label {
  margin-right: 1rem;
  font-weight: bold;
}
</style>

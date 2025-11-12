import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import axios from 'axios'
import './assets/tailwind.css'
import messages from './i18n/index.js'

// i18n setup
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages,
})

const app = createApp(App)
app.use(router)
app.use(i18n)

// Backend URL globally
app.config.globalProperties.$BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Global image helper
app.config.globalProperties.$getImageUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return path ? `${baseUrl}/${path.replace(/\\/g, '/')}` : 'https://via.placeholder.com/400x250.png?text=No+Image'
}

// Axios global defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('merchantToken')}`
app.config.globalProperties.$axios = axios

app.mount('#app')

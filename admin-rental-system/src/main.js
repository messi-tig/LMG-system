import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import am from './locales/am.json'
import om from './locales/om.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, am, om }
})

createApp(App).use(router).use(i18n).mount('#app')

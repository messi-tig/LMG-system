import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import am from './locales/am.json';
import om from './locales/om.json';

export const i18n = createI18n({
  legacy: false, // Composition API mode
  locale: localStorage.getItem('locale') || 'en', // default locale
  fallbackLocale: 'en',
  messages: { en, am, om },
});

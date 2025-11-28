import { createI18n } from 'vue-i18n';
import en from './i18n/locales/en.json';
import am from './i18n/locales/am.json';
import om from './i18n/locales/om.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, am, om },
});

export default i18n;

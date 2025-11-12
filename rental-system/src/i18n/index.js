import { createI18n } from "vue-i18n";
import en from "./en.json";
import am from "./am.json";
import om from "./om.json";

const messages = {
  en,
  am,
  om,
};

const i18n = createI18n({
  legacy: false,
  locale: "en", // default language
  fallbackLocale: "en",
  messages,
});

export default i18n; // ✅ This line is CRUCIAL

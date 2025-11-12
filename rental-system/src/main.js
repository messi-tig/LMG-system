import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import i18n from "./i18n/index.js"; // ✅ default export
import { createPinia } from "pinia"; // ✅ properly imported

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(i18n);
app.mount("#app");

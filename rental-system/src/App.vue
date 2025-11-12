<template>
  <div id="app">
    <!-- ✅ Show Dashboard (with sidebar) if logged in -->
    <DashboardLayout v-if="isLoggedIn" />

    <!-- 🚪 Show Public Pages (Login / Register) if not logged in -->
    <div v-else class="public-wrap">
      <header class="public-topbar">
        <!-- Centered Title -->
        <div class="public-topbar-center">
          <div class="title">{{ $t("welcome") }}</div>
        </div>

        <!-- 🌐 Right Language Selector -->
        <div class="public-topbar-right">
          <label for="lang-public" class="sr-only">{{ t("selectLanguage") }}</label>
          <select
            id="lang-public"
            v-model="locale"
            @change="changeLang"
            class="lang-select"
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromoo</option>
          </select>
        </div>
      </header>

      <main class="public-main">
        <RouterView />
      </main>

      <footer class="public-footer">
        © {{ new Date().getFullYear() }} LMG Tech System — {{ t("rights") }}
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import DashboardLayout from "./layout/DashboardLayout.vue";

const { t, locale } = useI18n();

// ✅ Track login state reactively
const isLoggedIn = ref(false);

// Check token in localStorage
function checkAuth() {
  isLoggedIn.value = !!localStorage.getItem("token");
}

onMounted(checkAuth);

// Update when localStorage changes (like logout)
window.addEventListener("storage", checkAuth);

// Also recheck reactively
watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem("token");
});

// 🌐 Change language
const changeLang = () => {
  localStorage.setItem("lang", locale.value);
};
</script>

<style>
/* ===== Public Layout ===== */
.public-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
}

/* ===== Topbar ===== */
.public-topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: gray;
  color:black;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

/* Centered title */
.public-topbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}

/* Right side (language selector) */
.public-topbar-right {
  position: absolute;
  right: 18px;
  display: flex;
  align-items: center;
}

.lang-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  background: white;
  color: #111827;
}

/* Main content below topbar */
.public-main {
  margin-top: 84px;
  padding: 24px;
}

/* Footer */
.public-footer {
  background: #111827;
  color: #fff;
  text-align: center;
  padding: 12px 0;
  margin-top: auto;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

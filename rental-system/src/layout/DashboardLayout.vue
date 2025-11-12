<template>
  <div class="layout">
    <!-- 🧭 Top Bar -->
    <header class="topbar">
      <div class="center">
        <div class="brand">{{ $t("welcome") }}</div>
      </div>

      <div class="right">
        <!-- 🌐 Language Selector -->
        <label for="lang-dash" class="sr-only">{{ t("selectLanguage") }}</label>
        <select id="lang-dash" v-model="locale" @change="changeLang" class="lang-select">
          <option value="en">English</option>
          <option value="am">አማርኛ</option>
          <option value="om">Afaan Oromoo</option>
        </select>

        <!-- 🚪 Logout Button -->
        <button class="logout" @click="logout">{{ t("logout") }}</button>
      </div>
    </header>

    <div class="main-area">
      <!-- 📂 Sidebar --><!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">LMG</div>

      <nav class="nav">
        <RouterLink to="/app/dashboard" active-class="active-link">
          🏠 {{ t("dashboard") }}
        </RouterLink>

        <RouterLink to="/app/property" active-class="active-link">
          🏢 {{ t("listOfProperties") }}
        </RouterLink>

        <RouterLink to="/app/booking" active-class="active-link">
          📝 {{ t("createBooking") }}
        </RouterLink>

        <RouterLink to="/app/my-bookings" active-class="active-link">
          📋 {{ t("myBookings") }}
        </RouterLink>

        <RouterLink to="/app/all-bookings" active-class="active-link">
          🌍 {{ t("allBookings") }}
        </RouterLink>

        <!-- ✅ New: Profile Link -->
        <RouterLink to="/app/profile" active-class="active-link">
          👤 {{ t("profile") }}
        </RouterLink>
      </nav>
    </aside>

      <!-- 📑 Main Content -->
      <section class="content">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t, locale } = useI18n();

const changeLang = () => {
  localStorage.setItem("lang", locale.value);
};

// ✅ Logout with full refresh to hide sidebar immediately
const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
  window.location.reload();
};
</script>

<style scoped>
/* ===== Layout ===== */
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
}

/* ===== Topbar ===== */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: gray;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Centered brand text */
.topbar .center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.brand {
  font-weight: 700;
  font-size: 18px;
}

/* Right controls (language + logout) */
.topbar .right {
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  background: white;
  color: #111827;
}

.logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  background: #dc2626;
}

/* ===== Main Area ===== */
.main-area {
  display: flex;
  width: 100%;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

/* ===== Sidebar ===== */
.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 200px;
  background: #d1d5db;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #9ca3af;
  overflow-y: auto;
}

.sidebar-brand {
  font-weight: 800;
  font-size: 20px;
  text-align: center;
  margin-bottom: 24px;
  color: black;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav a {
  color: black;
  text-decoration: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
}

.nav a.active-link,
.nav a:hover {
  background: #9ca3af;
  color: white;
}

/* ===== Main Content ===== */
.content {
  margin-left: 200px;
  padding: 24px;
  width: calc(100% - 200px);
  background: #f9fafb;
  min-height: calc(100vh - 64px);
}

/* ===== Accessibility ===== */
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

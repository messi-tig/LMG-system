<template>
  <aside class="sidebar">
    <ul>
      <li>
        <router-link to="/dashboard" active-class="active">
          🏠 {{ t('sidebar.home') }}
        </router-link>
      </li>
      <li>
        <router-link to="/properties" active-class="active">
          🏢 {{ t('sidebar.properties') }}
        </router-link>
      </li>
      <li>
        <router-link to="/properties/add" active-class="active">
          ➕ {{ t('sidebar.addProperty') }}
        </router-link>
      </li>
      <li>
        <router-link to="/Bookings" active-class="active">
          📖 {{ t('sidebar.bookings') }}
        </router-link>
      </li>
      <li>
        <router-link to="/profile" active-class="active">
          👤 {{ t('sidebar.profile') }}
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  min-height: 100vh;
}
ul { list-style: none; padding: 0; }
li { margin-bottom: 0.5rem; }
a {
  text-decoration: none;
  color: #6b79a0;
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: 0.2s;
}
a.active, a:hover { background-color: #7184b7; color: white; }
</style>

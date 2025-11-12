<template>
  <header class="navbar">
    <h1 class="logo">well come to lmg tech </h1>

    <div class="navbar-right">
      <span class="user-name">{{ merchantName }}</span>

      <select class="locale-select" v-model="locale" @change="onLocaleChange">
        <option value="en">EN</option>
        <option value="am">AM</option>
        <option value="om">OM</option>
      </select>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()
const merchantName = ref('')

onMounted(() => {
  const merchant = JSON.parse(localStorage.getItem('merchant'))
  merchantName.value = merchant?.name || 'Merchant'
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('merchant')
  router.push('/login')
}

function onLocaleChange() {
  localStorage.setItem('locale', locale.value)
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #a4aec9;
  color: #fff;
  padding: 0.75rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.locale-select {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #1f2937;
  cursor: pointer;
}

.logout-btn {
  background-color: #10b981;
  border: none;
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
</style>

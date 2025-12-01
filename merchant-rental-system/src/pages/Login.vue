<template>
  <div :class="['login-page', theme]">
    <!-- Top-right combined menu -->
    <div class="top-controls">
      <button class="top-button" @click="toggleTopMenu">⚙️</button>
      <div v-if="showTopMenu" class="top-menu">
        <LanguageSwitcher @change-language="changeLanguage" />
        <ThemeSwitcher @toggle-theme="toggleTheme" :current-theme="theme" />
      </div>
    </div>

    <!-- Login card -->
    <div class="login-card">
      <h1 class="login-title">{{ $t('app.title') }}</h1>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label>{{ $t('login.email') }}</label>
          <input
            v-model="email"
            type="email"
            :placeholder="$t('login.email')"
            required
          />
        </div>

        <div class="form-group password-group">
          <label>{{ $t('login.password') }}</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              :placeholder="$t('login.password')"
              required
            />
            <button type="button" @click="togglePassword">
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? $t('login.loggingIn') : $t('login.login') }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const showTopMenu = ref(false)
const router = useRouter()
const { locale } = useI18n()
const theme = ref('light')

// Load saved theme
onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'light'
  document.documentElement.className = theme.value
})

// Toggle password visibility
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Toggle top menu
function toggleTopMenu() {
  showTopMenu.value = !showTopMenu.value
}

// Language change
function changeLanguage(lang) {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// Theme toggle
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.className = theme.value
  localStorage.setItem('theme', theme.value)
}

// Login function
async function login() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await axios.post(
      'https://lmgtech-4.onrender.com/merchant/login',
      { email: email.value, password: password.value }
    )
    localStorage.setItem('merchantToken', data.token)
    localStorage.setItem('merchant', JSON.stringify(data.merchant))
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6, #1e3a8a);
  font-family: 'Inter', sans-serif;
  position: relative;
}

/* Top-right controls */
.top-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.top-button {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
}

.top-menu {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: white;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Card */
.login-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

/* Titles */
.login-title {
  font-size: 1.8rem;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  box-sizing: border-box;
}

.form-group input::placeholder {
  font-size: 0.95rem;
  color: #9ca3af;
}

/* Password wrapper */
.password-wrapper {
  position: relative;
}

.password-wrapper button {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
}

/* Submit button */
button[type="submit"] {
  width: 100%;
  padding: 0.8rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

button[type="submit"]:hover {
  background-color: #1d4ed8;
}

/* Error message */
.error {
  color: #ef4444;
  margin-top: 0.75rem;
  font-weight: 500;
}

/* Dark mode */
.dark .login-card {
  background-color: #1f2937;
  color: #f3f4f6;
}

.dark .login-page {
  background: linear-gradient(135deg, #111827, #1e3a8a);
}

.dark input {
  background-color: #374151;
  color: #f3f4f6;
  border: 1px solid #4b5563;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .form-group input {
    padding: 0.7rem 0.8rem;
    font-size: 0.95rem;
  }

  .form-group input::placeholder {
    font-size: 0.9rem;
  }

  .password-wrapper button {
    font-size: 1rem;
  }

  button[type="submit"] {
    font-size: 0.95rem;
    padding: 0.7rem;
  }
}
</style>

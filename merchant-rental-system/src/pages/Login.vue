<template>
  <div :class="['login-page', theme]">
    <!-- Top-right controls -->
    <div class="top-controls">
      <LanguageSwitcher @change-language="changeLanguage" />
      <ThemeSwitcher @toggle-theme="toggleTheme" :current-theme="theme" />
    </div>

    <!-- Login card -->
    <div class="login-card">
      <h1 class="login-title">{{ $t('app.title') }} </h1>

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
            <button type="button" @click="togglePassword">{{ showPassword ? '🙈' : '👁' }}</button>
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
    const { data } = await axios.post('http://localhost:3000/merchant/login', {
      email: email.value,
      password: password.value
    })
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
  background: linear-gradient(135deg, #f3f4f6, #1e3a8a);
  position: relative;
  font-family: 'Inter', sans-serif;
}

/* Top-right controls */
.top-controls {
  position: absolute;
  top: 1rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Card */
.login-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 420px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.login-card:hover {
  transform: translateY(-3px);
}

/* Titles */
.login-title {
  font-size: 2rem;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 2rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.3rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
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
  padding: 0.9rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

button[type="submit"]:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

/* Error message */
.error {
  color: #ef4444;
  margin-top: 1rem;
  font-weight: 500;
}

/* Forgot password */
.forgot-password {
  margin-top: 1rem;
  font-size: 0.85rem;
}

.forgot-password a {
  color: #2563eb;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

/* Dark mode */
.dark .login-card {
  background-color: #1f2937;
  color: #f3f4f6;
}

.dark .login-page {
  background: linear-gradient(135deg, #111827, #1e3a8a);
}

.dark .form-group label,
.dark .password-wrapper button,
.dark .forgot-password a {
  color: #f3f4f6;
}

.dark input {
  background-color: #374151;
  color: #f3f4f6;
  border: 1px solid #4b5563;
}
</style>

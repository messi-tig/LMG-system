<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ $t('login') }}</h2>

      <form @submit.prevent="submitLogin">
        <!-- Email -->
        <input
          v-model="email"
          type="email"
          :placeholder="$t('email')"
          required
        />

        <!-- Password with Toggle -->
        <div class="password-field">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('password')"
            required
          />
          <button type="button" class="toggle-password" @click="togglePassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? $t('logging_in') : $t('login') }}
        </button>

        <!-- Switch to Register -->
        <p class="switch-link" @click="goToRegister">
          {{ $t('dont_have_account') }}?
          <span>{{ $t('Register') }}</span>
        </p>
      </form>

      <!-- Error Message -->
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../utils/Api'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    const showPassword = ref(false)
    const router = useRouter()

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const submitLogin = async () => {
      try {
        loading.value = true
        const lang = localStorage.getItem('locale') || 'en'

        const response = await api.post(
          '/login',
          { email: email.value, password: password.value },
          { headers: { 'Accept-Language': lang } }
        )

        const token = response.data.accessToken
        if (!token) throw new Error('No token returned from server')

        // Save token
        localStorage.setItem('adminToken', token)
        error.value = ''

        // Short loading time before navigating to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000) // 1 second delay
      } catch (err) {
        console.error('❌ Login failed:', err)
        error.value = err.response?.data?.message || err.message || 'Login failed'
      } finally {
        loading.value = false
      }
    }

    const goToRegister = () => {
      router.push('/register')
    }

    return { email, password, error, loading, showPassword, togglePassword, submitLogin, goToRegister }
  },
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.auth-card {
  background: #fff;
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #333;
}

.auth-card input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Password Input Container */
.password-field {
  display: flex;
  align-items: center;
  position: relative;
}

.password-field input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.auth-card button[type='submit'] {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.auth-card button[type='submit']:hover:not(:disabled) {
  background-color: #0056b3;
}

.auth-card button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading Spinner */
.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 8px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.switch-link {
  margin-top: 15px;
  cursor: pointer;
  color: #007bff;
  font-size: 14px;
}

.switch-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>

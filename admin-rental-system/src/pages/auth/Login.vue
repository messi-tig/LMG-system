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

        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
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
/* ==============================
   GLOBAL CONTAINER
================================= */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;
  background: #f0f2f5;
}

/* ==============================
   CARD
================================= */
.auth-card {
  background: #fff;
  padding: 25px 20px;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

/* Title */
.auth-card h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

/* ==============================
   INPUT FIELDS
================================= */
.auth-card input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
  transition: 0.2s;
}

.auth-card input:focus {
  border-color: #007bff;
  box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
  background: #fff;
}

/* ==============================
   PASSWORD FIELD WITH TOGGLE
================================= */
.password-field {
  position: relative;
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.password-field input {
  flex: 1;
  padding-right: 42px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #555;
  padding: 5px;
  transition: 0.2s;
}

.toggle-password:hover {
  opacity: 0.8;
}

/* ==============================
   SUBMIT BUTTON
================================= */
.auth-card button[type='submit'] {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.auth-card button[type='submit']:hover:not(:disabled) {
  background-color: #0056b3;
}

.auth-card button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ==============================
   LOADING SPINNER
================================= */
.loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-right: 8px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==============================
   SWITCH LINK & ERROR
================================= */
.switch-link {
  margin-top: 15px;
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
}

.switch-link span {
  font-weight: bold;
}

.switch-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
}

/* ==============================
   RESPONSIVE DESIGN
================================= */
@media (max-width: 480px) {
  .auth-card {
    padding: 20px 15px;
    max-width: 90%;
  }

  .auth-card h2 {
    font-size: 20px;
  }

  .auth-card input,
  .auth-card button[type='submit'] {
    font-size: 14px;
    padding: 10px;
  }

  .toggle-password {
    font-size: 16px;
  }

  .switch-link {
    font-size: 12px;
  }

  .error {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .auth-card {
    padding: 26px 20px;
  }

  .auth-card h2 {
    font-size: 22px;
  }
}
</style>

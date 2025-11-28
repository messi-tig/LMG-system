<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ $t('register') }}</h2>

      <form @submit.prevent="submitRegister">
        <input v-model="fullName" type="text" :placeholder="$t('name')" required />
        <input v-model="email" type="email" :placeholder="$t('email')" required />

        <div class="password-container">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('password')"
            required
          />
          <button type="button" class="toggle-password" @click="togglePassword">
            {{ showPassword ? '🙈' : '👁' }}
          </button>
        </div>

        <input v-model="phonenumber" type="text" placeholder="Phone Number" required />
        <input v-model="address" type="text" placeholder="Address" required />

        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="progress-bar"></span>
          {{ loading ? $t('loading') : $t('register') }}
        </button>

        <p class="switch-link" @click="goToLogin">
          {{ $t('already Have Account') }} <strong>{{ $t('Log in') }}</strong>
        </p>
      </form>

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
    const fullName = ref('')
    const email = ref('')
    const password = ref('')
    const phonenumber = ref('')
    const address = ref('')
    const error = ref('')
    const loading = ref(false)
    const showPassword = ref(false)
    const router = useRouter()

    const togglePassword = () => (showPassword.value = !showPassword.value)

    const submitRegister = async () => {
      try {
        loading.value = true
        error.value = ''
        const lang = localStorage.getItem('locale') || 'en'

        await api.post(
          '/register',
          { fullName: fullName.value, email: email.value, password: password.value, phonenumber: Number(phonenumber.value), address: address.value },
          { headers: { 'Accept-Language': lang } }
        )

        setTimeout(() => router.push('/dashboard'), 1500)
      } catch (err) {
        console.error('❌ Registration failed:', err)
        error.value = err.response?.data?.message || 'Registration failed'
      } finally {
        loading.value = false
      }
    }

    const goToLogin = () => router.push('/login')

    return { fullName, email, password, phonenumber, address, error, loading, showPassword, togglePassword, submitRegister, goToLogin }
  },
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  padding: 15px;
  box-sizing: border-box;
}

.auth-card {
  background: #fff;
  padding: 25px 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.auth-card h2 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #1e3a8a;
  font-weight: 700;
}

.auth-card input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
  margin: 8px 0;
}

.password-container input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: #555;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: rgba(255, 255, 255, 0.3);
  animation: progress 1.5s linear forwards;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

.switch-link {
  margin-top: 15px;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 20px 15px;
  }
  .auth-card h2 {
    font-size: 20px;
  }
  .auth-card input,
  .submit-btn {
    font-size: 14px;
    padding: 10px;
  }
  .toggle-password {
    font-size: 16px;
  }
  .switch-link {
    font-size: 12px;
  }
}
</style>

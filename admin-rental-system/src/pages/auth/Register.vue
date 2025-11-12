<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ $t('register') }}</h2>

      <form @submit.prevent="submitRegister">
        <input
          v-model="fullName"
          type="text"
          :placeholder="$t('name')"
          required
        />
        <input
          v-model="email"
          type="email"
          :placeholder="$t('email')"
          required
        />

        <!-- Password Input with Show/Hide -->
        <div class="password-container">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('password')"
            required
          />
          <button
            type="button"
            class="toggle-password"
            @click="togglePassword"
          >
            {{ showPassword ? '🙈' : '👁' }}
          </button>
        </div>

        <input
          v-model="phonenumber"
          type="text"
          placeholder="Phone Number"
          required
        />
        <input
          v-model="address"
          type="text"
          placeholder="Address"
          required
        />

        <!-- Submit button with progress -->
        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="progress-bar"></span>
          {{ loading ? $t('loading') : $t('register') }}
        </button>

        <!-- Switch to Login -->
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

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const submitRegister = async () => {
      try {
        loading.value = true
        error.value = ''

        const lang = localStorage.getItem('locale') || 'en'

        await api.post(
          '/register',
          {
            fullName: fullName.value,
            email: email.value,
            password: password.value,
            phonenumber: Number(phonenumber.value),
            address: address.value,
          },
          { headers: { 'Accept-Language': lang } }
        )

        // simulate loading and then redirect
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } catch (err) {
        console.error('❌ Registration failed:', err)
        error.value = err.response?.data?.message || 'Registration failed'
      } finally {
        loading.value = false
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    return {
      fullName,
      email,
      password,
      phonenumber,
      address,
      error,
      loading,
      showPassword,
      togglePassword,
      submitRegister,
      goToLogin,
    }
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
}

.auth-card {
  background: #fff;
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  width: 380px;
  text-align: center;
  animation: fadeIn 0.4s ease-in-out;
}

.auth-card h2 {
  margin-bottom: 15px;
  font-size: 24px;
  color: #1e3a8a;
  font-weight: 700;
}

.auth-card input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: 0.3s;
}

.auth-card input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.4);
}

/* Password Input Container */
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
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #555;
  transition: color 0.2s ease;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading progress bar */
.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: rgba(255, 255, 255, 0.3);
  animation: progress 1.5s linear forwards;
}

@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

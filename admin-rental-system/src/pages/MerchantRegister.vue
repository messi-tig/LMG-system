<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
    <div class="auth-card w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fadeIn">
      <h2 class="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-wide">
        {{ $t('merchant.title') }}
      </h2>

      <form @submit.prevent="registerMerchant" enctype="multipart/form-data" class="flex flex-col space-y-4">
        <!-- Full Name -->
        <div>
          <label class="form-label">{{ $t('merchant.fullName') }}</label>
          <input v-model="form.fullName" type="text" :placeholder="$t('merchant.fullNamePlaceholder')" class="form-input" required />
        </div>

        <!-- Email -->
        <div>
          <label class="form-label">{{ $t('merchant.email') }}</label>
          <input v-model="form.email" type="email" :placeholder="$t('merchant.emailPlaceholder')" class="form-input" required />
        </div>

        <!-- Password -->
        <div class="relative">
          <label class="form-label">{{ $t('merchant.password') }}</label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('merchant.passwordPlaceholder')"
            class="form-input pr-10"
            required
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition duration-200"
          >
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 animate-spin-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.99 9.99 0 013.215-7.317M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M21 21l-6-6m-2.5-2.5A3 3 0 0012 9a3 3 0 00-2.5 1.5M3 3l18 18M3.98 8.223A10.053 10.053 0 0112 5c5.523 0 10 4.477 10 10 0 1.642-.404 3.191-1.12 4.557" />
            </svg>
          </button>
        </div>

        <!-- Phone -->
        <div>
          <label class="form-label">{{ $t('merchant.phone') }}</label>
          <input v-model="form.phonenumber" type="number" :placeholder="$t('merchant.phonePlaceholder')" class="form-input" required />
        </div>

        <!-- Business Name -->
        <div>
          <label class="form-label">{{ $t('merchant.businessName') }}</label>
          <input v-model="form.businessName" type="text" :placeholder="$t('merchant.businessNamePlaceholder')" class="form-input" required />
        </div>

        <!-- Address -->
        <div>
          <label class="form-label">{{ $t('merchant.address') }}</label>
          <input v-model="form.address" type="text" :placeholder="$t('merchant.addressPlaceholder')" class="form-input" required />
        </div>

        <!-- Account Number -->
        <div>
          <label class="form-label">{{ $t('merchant.accountNumber') }}</label>
          <input v-model="form.acountnumber" type="number" :placeholder="$t('merchant.accountNumberPlaceholder')" class="form-input" required />
        </div>

        <!-- Profile Picture -->
        <div>
          <label class="form-label">{{ $t('merchant.profilePicture') }}</label>
          <input type="file" @change="handleFileUpload" class="form-input-file" accept="image/*" />
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="loading" class="btn-submit mt-4">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? $t('merchant.loading') : $t('merchant.submit') }}
        </button>

        <!-- Message -->
        <p
          v-if="message"
          :class="[ 'text-center font-semibold mt-4 transition', isError ? 'text-red-600' : 'text-green-600' ]"
        >
          {{ message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// ✅ Match backend DTO field names exactly
const form = ref({
  fullName: '',
  email: '',
  password: '',
  phonenumber: '',
  acountnumber: '',
  businessName: '',
  address: '',
  profilePictureFile: null,
})

const loading = ref(false)
const message = ref('')
const isError = ref(false)
const showPassword = ref(false)

const togglePassword = () => (showPassword.value = !showPassword.value)

const handleFileUpload = (e) => {
  form.value.profilePictureFile = e.target.files[0]
}

const registerMerchant = async () => {
  try {
    loading.value = true
    message.value = ''
    isError.value = false

    // ✅ Build FormData (matches backend IMerchantRegistrationPayload)
    const formData = new FormData()
    Object.keys(form.value).forEach((key) => {
      if (form.value[key] !== null) formData.append(key, form.value[key])
    })

    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert(t('merchant.loginPrompt'))
      loading.value = false
      return
    }

    // ✅ Send request with correct headers (NestJS I18n uses 'accept-language')
    const response = await axios.post(
      'http://localhost:3000/merchant/register',
      formData,
      {
        headers: {
          'accept-language': locale.value,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    message.value = response.data.message || t('merchant.success')
    isError.value = false

    // ✅ Reset form after successful registration
    Object.keys(form.value).forEach((key) => (form.value[key] = key === 'profilePictureFile' ? null : ''))
  } catch (err) {
    console.error('❌ Registration failed:', err.response?.data || err)
    message.value = err.response?.data?.message || t('merchant.failed')
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }

.auth-card { transition: all 0.3s ease; }
.auth-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); }

.form-label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.3rem; font-size: 0.9rem; }

.form-input {
  width: 50%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  background-color: #f9fafb;
}
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
  background-color: #fff;
}

.form-input-file {
  width: 50%;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
}
.form-input-file:hover {
  border-color: #2563eb;
  background-color: #f1f5f9;
}

.btn-submit {
  width: 50%;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.35);
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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
@keyframes spin { to { transform: rotate(360deg); } }

.animate-spin-slow { animation: spin 1s linear infinite; }
.animate-bounce { animation: bounce 0.6s ease-in-out infinite alternate; }
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-3px); }
}

.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
</style>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <div
      class="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-3xl transition-all duration-300 hover:shadow-blue-200/80"
    >
      <h2 class="text-4xl font-extrabold text-center text-blue-700 mb-2">
        {{ t("register.title") }}
      </h2>
      <p class="text-center text-gray-500 mb-8">
        {{ t("register.subtitle") || 'Create your account in a few easy steps' }}
      </p>

      <form
        @submit.prevent="handleRegister"
        enctype="multipart/form-data"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Full Name -->
        <div class="group">
          <label class="label">{{ t("register.fullName") }}</label>
          <input
            v-model="form.fullName"
            type="text"
            :placeholder="t('register.fullNamePlaceholder')"
            class="input focus:ring-blue-400"
            required
          />
        </div>

        <!-- Email -->
        <div class="group">
          <label class="label">{{ t("register.email") }}</label>
          <input
            v-model="form.email"
            type="email"
            :placeholder="t('register.emailPlaceholder')"
            class="input focus:ring-blue-400"
            required
          />
        </div>

        <!-- Password -->
        <div class="group md:col-span-2">
          <label class="label">{{ t("register.password") }}</label>
          <div class="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 transition">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              :placeholder="t('register.passwordPlaceholder')"
              class="flex-1 px-3 py-2 bg-white focus:outline-none"
              required
            />
            <button
              type="button"
              @click="togglePassword"
              class="px-4 text-blue-600 font-medium hover:bg-blue-50 transition"
            >
              {{ showPassword ? t('register.hide') : t('register.show') }}
            </button>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="group">
          <label class="label">{{ t("register.phone") }}</label>
          <input
            v-model="form.phonenumber"
            type="number"
            :placeholder="t('register.phonePlaceholder')"
            class="input focus:ring-blue-400"
            required
          />
        </div>

        <!-- Account Number -->
        <div class="group">
          <label class="label">{{ t("register.accountNumber") }}</label>
          <input
            v-model="form.acountnumber"
            type="number"
            :placeholder="t('register.accountNumberPlaceholder')"
            class="input focus:ring-blue-400"
            required
          />
        </div>

        <!-- Address -->
        <div class="group md:col-span-2">
          <label class="label">{{ t("register.address") }}</label>
          <input
            v-model="form.address"
            type="text"
            :placeholder="t('register.addressPlaceholder')"
            class="input focus:ring-blue-400"
            required
          />
        </div>

        <!-- Profile Picture -->
        <div class="group md:col-span-2">
          <label class="label">{{ t("register.profilePicture") }}</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="block w-full text-sm text-gray-600 border border-gray-300 rounded-xl cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="col-span-2 text-center mt-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-10 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          >
            <span v-if="loading">{{ t("register.loading") }}</span>
            <span v-else>{{ t("register.submit") }}</span>
          </button>

          <p v-if="message" class="text-green-600 mt-3 font-medium">
            {{ message }}
          </p>
          <p v-if="error" class="text-red-600 mt-3 font-medium">
            {{ error }}
          </p>
        </div>
      </form>

      <!-- Login Redirect -->
      <div class="text-center text-sm text-gray-600 mt-6">
        {{ t("register.alreadyHaveAccount") }}
        <router-link to="/login" class="text-blue-600 font-semibold hover:underline">
          {{ t("register.loginHere") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { registerCustomer } from "../services/customerService.js";

const { t, locale } = useI18n();

const form = ref({
  fullName: "",
  email: "",
  password: "",
  phonenumber: "",
  acountnumber: "",
  address: "",
});
const file = ref(null);
const loading = ref(false);
const message = ref("");
const error = ref("");
const showPassword = ref(false);

function handleFileUpload(e) {
  file.value = e.target.files[0];
}

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleRegister() {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const formData = new FormData();
    Object.entries(form.value).forEach(([key, value]) => formData.append(key, value));
    if (file.value) formData.append("profilePicture", file.value);

    const res = await registerCustomer(formData, locale.value);
    console.log("✅ Registration response:", res);

    message.value = t("register.success");
    form.value = { fullName: "", email: "", password: "", phonenumber: "", acountnumber: "", address: "" };
    file.value = null;
  } catch (err) {
    console.error("❌ Registration failed:", err);
    error.value = t("register.failed");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white;
}

.label {
  @apply block text-gray-700 text-sm font-semibold mb-2;
}

.group {
  @apply relative;
}
</style>

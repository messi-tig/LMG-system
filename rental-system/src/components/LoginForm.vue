<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f3f4f6;
      flex-direction: column;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 400px;
        background-color: white;
        padding: 40px;
        border-radius: 18px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      "
    >
      <h2
        style="
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 25px;
          color: #111827;
        "
      >
        {{ $t("login") }}
      </h2>

      <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 18px;">
        <div>
          <label>{{ $t("email") }}</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@mail.com"
            required
            style="border: 1px solid #d1d5db; border-radius: 10px; padding: 12px; font-size: 15px;"
          />
        </div>

        <div>
          <label>{{ $t("password") }}</label>
          <div
            style="display: flex; align-items: center; border: 1px solid #d1d5db; border-radius: 10px;"
          >
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="•••••••"
              required
              style="flex: 1; border: none; padding: 12px; font-size: 15px; border-radius: 10px;"
            />
            <button
              type="button"
              @click="togglePassword"
              style="background: none; border: none; color: #2563eb; cursor: pointer;"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          style="background-color: gray; color:black; border: none; border-radius: 10px; padding: 12px; font-size: 17px; font-weight: 600;"
        >
          {{ loading ? "Logging in..." : $t("login") }}
        </button>

        <p v-if="message" style="color: #16a34a; text-align: center;">{{ message }}</p>
        <p v-if="error" style="color: #dc2626; text-align: center;">{{ error }}</p>
      </form>

      <div style="text-align: center; margin-top: 24px;">
        <p>
          {{ $t("noAccount") }}
          <router-link to="/register" style="color: #2563eb; font-weight: 600;">
            {{ $t("createAccount") }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { loginCustomer } from "../services/customerService.js";

const { t } = useI18n();
const router = useRouter();

const form = ref({ email: "", password: "" });
const loading = ref(false);
const message = ref("");
const error = ref("");
const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleLogin() {
  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const lang = localStorage.getItem("lang") || "en";
    const res = await loginCustomer(form.value, lang);

    if (res.token) {
      localStorage.setItem("token", res.token);
   
      // ✅ redirect to dashboard (which shows sidebar) 
       setTimeout(() => router.push("/app/dashboard"), 1000); // ✅ use /app/dashboard
    } else {
      error.value = "Invalid credentials.";
    }
  } catch (err) {
    error.value = err.message || "Login failed.";
  } finally {
    loading.value = false;
  }
}
</script>

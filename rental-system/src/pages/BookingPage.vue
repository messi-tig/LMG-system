<template>
  <div class="booking-wrapper">
    <div class="booking-card">
      <h2>{{ t('bookingTitle') }}</h2>

      <form @submit.prevent="handleBooking" class="booking-form">
        <!-- Property Name -->
        <div class="form-group">
          <label>{{ t('propertyName') }}</label>
          <input
            v-model="form.assetName"
            type="text"
            :placeholder="t('enterProperty')"
            required
          />
        </div>

        <!-- Merchant Email -->
        <div class="form-group">
          <label>{{ t('merchantEmail') }}</label>
          <input
            v-model="form.merchantEmail"
            type="email"
            placeholder="example@merchant.com"
            required
          />
        </div>

        <!-- Start and End Dates -->
        <div class="form-row">
          <div class="form-group half">
            <label>{{ t('checkIn') }}</label>
            <input v-model="form.startDate" type="date" required />
          </div>
          <div class="form-group half">
            <label>{{ t('checkOut') }}</label>
            <input v-model="form.endDate" type="date" required />
          </div>
        </div>

        <!-- Number of Property -->
        <div class="form-group">
          <label>{{ t('numberOfProperty') }}</label>
          <input
            v-model.number="form.numberOfProperty"
            type="number"
            min="1"
            required
          />
        </div>

        <!-- Time Interval -->
        <div class="form-group">
          <label>{{ t('timeInterval') }}</label>
          <select v-model="form.timeInterval" required>
            <option value="hour">{{ t('hour') }}</option>
            <option value="day">{{ t('day') }}</option>
            <option value="week">{{ t('week') }}</option>
            <option value="month">{{ t('month') }}</option>
            <option value="year">{{ t('year') }}</option>
          </select>
        </div>

        <!-- Security Deposit -->
        <div class="form-group">
          <label>{{ t('securityDeposit') }}</label>
          <input
            v-model.number="form.securityDeposit"
            type="number"
            min="0"
            :placeholder="t('optionalDeposit')"
          />
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="loading">
          {{ loading ? t('submitting') : t('submitBooking') }}
        </button>
      </form>

      <!-- Feedback -->
      <p v-if="message" class="success-msg">{{ message }}</p>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { createBooking } from "../services/bookingService.js";

const { t } = useI18n();

const form = ref({
  assetName: "",
  merchantEmail: "",
  startDate: "",
  endDate: "",
  timeInterval: "day",
  numberOfProperty: 1,
  securityDeposit: 0,
});

const message = ref("");
const error = ref("");
const loading = ref(false);

async function handleBooking() {
  const token = localStorage.getItem("token");
  if (!token) {
    error.value = t("notLoggedIn");
    return;
  }

  loading.value = true;
  message.value = "";
  error.value = "";

  try {
    const lang = localStorage.getItem("lang") || "en";
    await createBooking(form.value, token, lang);
    message.value = t("bookingSuccess");
  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    error.value = err.response?.data?.message || t("bookingFailed");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.booking-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  justify-content: flex-start; /* move to left side */
  align-items: flex-start;
  padding: 40px;
  box-sizing: border-box;
}

.booking-card {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-left: 0;
}

.booking-card h2 {
  text-align: left;
  color: #1e3a8a;
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 20px;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2563eb;
  outline: none;
}

.form-row {
  display: flex;
  gap: 12px;
}

.half {
  flex: 1;
}

button {
  padding: 12px;
  background-color:wheat;
  color:black;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color:gray;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  color: green;
  text-align: left;
  margin-top: 10px;
}

.error-msg {
  color: red;
  text-align: left;
  margin-top: 10px;
}
</style>

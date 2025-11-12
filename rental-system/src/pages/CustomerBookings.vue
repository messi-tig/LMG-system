<template>
  <div class="page">
    <h2>{{ t('myBookings') }}</h2>

    <!-- Loading and Errors -->
    <div v-if="loading" class="loading">{{ t('loadingBookings') }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Bookings List -->
    <div v-if="bookings.length" class="booking-list">
      <div
        v-for="b in bookings"
        :key="b.bookingId"
        class="booking-card"
      >
        <h3>{{ b.assetName }}</h3>
        <p><b>{{ t('merchant') }}:</b> {{ b.merchant.name }} ({{ b.merchant.phone }})</p>
        <p><b>{{ t('numberOfProperty') }}:</b> {{ b.numberOfProperty }}</p>
        <p><b>{{ t('duration') }}:</b> {{ formatDate(b.startDate) }} → {{ formatDate(b.endDate) }}</p>
        <p><b>{{ t('status') }}:</b> {{ b.status }}</p>
        <p><b>{{ t('totalPrice') }}:</b> {{ b.totalPrice }}</p>

        <!-- Upload Section -->
        <div class="upload-section">
          <label>{{ t('uploadProof') }}</label>
          <input type="file" @change="(e) => uploadProof(e, b.bookingId)" />
        </div>

        <!-- Add/Hide Details -->
        <button class="toggle-btn" @click="toggleDetails(b)">
          {{ b.showDetails ? t('hideDetails') : t('viewDetails') }}
        </button>

        <!-- Details Section (hidden by default) -->
        <div v-if="b.showDetails" class="details-section">
          <p><b>ID:</b> {{ b.bookingId }}</p>
          <p><b>{{ t('merchant') }} Email:</b> {{ b.merchant.email }}</p>
          <p><b>{{ t('duration') }}:</b> {{ formatDate(b.startDate) }} → {{ formatDate(b.endDate) }}</p>
          <p><b>{{ t('totalPrice') }}:</b> {{ b.totalPrice }}</p>
          <p><b>{{ t('status') }}:</b> {{ b.status }}</p>

          <!-- Property Images -->
          <div class="image-gallery" v-if="b.imageUrls?.length">
            <p><b>{{ t('propertyImages') }}:</b></p>
            <div class="image-row">
              <img
                v-for="img in b.imageUrls"
                :key="img"
                :src="formatImageUrl(img)"
                alt="Property"
                class="thumb"
              />
            </div>
          </div>

          <!-- Payment Proof -->
          <div class="image-gallery" v-if="b.paymentProofPath">
            <p><b>{{ t('paymentProof') }}:</b></p>
            <img
              :src="formatImageUrl(b.paymentProofPath)"
              alt="Payment Proof"
              class="thumb"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !error">{{ t('noBookings') }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

const { t } = useI18n();

const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

const bookings = ref([]);
const loading = ref(false);
const error = ref("");

async function getMyBookings() {
  loading.value = true;
  const lang = localStorage.getItem("lang") || "en";

  try {
    const res = await axios.get(`${API_URL}/customer/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lang },
    });
    bookings.value = res.data.bookings.map((b) => ({
      ...b,
      showDetails: false,
    }));
  } catch (err) {
    error.value = err.response?.data?.message || t("loadFailed");
  } finally {
    loading.value = false;
  }
}

function toggleDetails(booking) {
  booking.showDetails = !booking.showDetails;
}

async function uploadProof(event, bookingId) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("paymentProof", file);

    const res = await axios.post(
      `${API_URL}/customer/bookings/${bookingId}/payment-proof`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    alert(res.data.message || t("uploadSuccess"));
    getMyBookings();
  } catch (err) {
    alert(err.response?.data?.message || t("uploadFailed"));
  }
}

function formatImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

onMounted(getMyBookings);
</script>

<style scoped>
.page {
  padding: 20px;
  background-color: #f3f4f6;
  min-height: 100vh;
}

h2 {
  text-align: center;
  color: #1e3a8a;
  margin-bottom: 20px;
}

.booking-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start; /* ✅ align to left */
}

.booking-card {
  width: 300px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.booking-card h3 {
  font-size: 18px;
  color: #1e3a8a;
  margin-bottom: 10px;
}

.upload-section {
  margin-top: 10px;
}

.toggle-btn {
  margin-top: 10px;
  padding: 8px;
  width: 100%;
  background-color: #2564eb81;
  color: black;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #dfd8d3cb;
}

.details-section {
  background: #f9fafb;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 14px;
}

/* ✅ image area inside details only */
.image-gallery {
  margin-top: 10px;
}

.image-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.thumb {
  width: 164px;
  height: 164px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.loading {
  text-align: center;
  color: #555;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 10px;
}
</style>

<template>
  <div class="page">
    <h2>{{ $t("availableProperties") }}</h2>

    <!-- 🔍 Filter Form -->
    <form @submit.prevent="fetchProperties" class="filter-form">
      <select v-model="category" required>
        <option disabled value="">{{ $t("selectCategory") }}</option>
        <option value="EventSupply">Event Supply</option>
        <option value="ConstructionEquipment">Construction Equipment</option>
        <option value="HealthcareMedical">Healthcare & Medical</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">{{ $t("search") }}</button>
    </form>

    <!-- 🌀 Loading & Error -->
    <div v-if="loading" class="loading">{{ $t("loading") }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 🏘️ Property List -->
    <div v-if="properties.length" class="property-list">
      <div v-for="p in properties" :key="p._id" class="property-card">
        <!-- ✅ Basic Info -->
        <h3>{{ p.name }}</h3>
        <p><b>{{ $t("category") }}:</b> {{ p.category }}</p>
        <p><b>{{ $t("status") }}:</b> {{ p.status }}</p>

        <!-- 🖼️ Images -->
        <div class="image-gallery" v-if="p.imageUrls?.length">
          <img
            v-for="img in p.imageUrls"
            :key="img"
            :src="formatImageUrl(img)"
            alt="Property Image"
            class="thumb"
            @error="handleImageError"
          />
        </div>

        <!-- 🔽 Toggle Details -->
        <button @click="toggleDetails(p)" class="details-btn">
          {{ p.showDetails ? $t("hide") : $t("details") }}
        </button>

        <!-- 📋 Details Section -->
        <div v-if="p.showDetails" class="details">
          <p><b>{{ $t("description") }}:</b> {{ p.description }}</p>
          <p><b>{{ $t("priceUnit") }}:</b> {{ p.priceUnit }}</p>
          <p><b>{{ $t("numberOfProperty") }}:</b> {{ p.numberOfProperty }}</p>

          <!-- 💰 Rental Prices -->
          <div class="rental" v-if="p.rentalPrice">
            <p><b>{{ $t("rentalPrices") }}:</b></p>
            <ul>
              <li>Hour: {{ p.rentalPrice.perHour }}</li>
              <li>Day: {{ p.rentalPrice.perDay }}</li>
              <li>Month: {{ p.rentalPrice.perMonth }}</li>
              <li>Year: {{ p.rentalPrice.perYear }}</li>
            </ul>
          </div>

          <!-- 🧍 Merchant Info -->
          <div class="merchant-info">
            <h4>{{ $t("merchantInfo") }}</h4>
            <p><b>{{ $t("name") }}:</b> {{ p.merchant?.name }}</p>
            <p><b>{{ $t("email") }}:</b> {{ p.merchant?.email }}</p>
            <p><b>{{ $t("phone") }}:</b> {{ p.merchant?.phone }}</p>
            <p><b>{{ $t("businessName") }}:</b> {{ p.merchant?.businessName }}</p>
            <p><b>{{ $t("accountNumber") }}:</b> {{ p.merchant?.acountnumber }}</p>
          </div>

          <!-- 📅 Booking Details -->
          <div v-if="p.bookingDetails" class="booking-info">
            <h4>{{ $t("bookingDetails") }}</h4>
            <p><b>{{ $t("startDate") }}:</b> {{ formatDate(p.bookingDetails.startDate) }}</p>
            <p><b>{{ $t("endDate") }}:</b> {{ formatDate(p.bookingDetails.endDate) }}</p>
            <p><b>{{ $t("numberOfProperty") }}:</b> {{ p.bookingDetails.numberOfProperty }}</p>
          </div>

          <div v-else>
            <p class="no-bookings">{{ $t("noBookingsForThisProperty") }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !error">
      {{ $t("noProperties") }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

const category = ref("");
const properties = ref([]);
const totalProperties = ref(0);
const loading = ref(false);
const error = ref("");

// ===========================================================
// 🟢 Fetch Properties from /customer/properties
// ===========================================================
async function fetchProperties() {
  loading.value = true;
  error.value = "";
  const lang = localStorage.getItem("lang") || "en";

  try {
    const res = await axios.get(`${API_URL}/customer/properties`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { category: category.value, lang },
    });

    totalProperties.value = res.data.totalProperties || 0;
    properties.value = (res.data.properties || []).map((p) => ({
      ...p,
      showDetails: false,
    }));
  } catch (err) {
    console.error("❌ Error fetching properties:", err);
    error.value = err.response?.data?.message || t("noProperties");
  } finally {
    loading.value = false;
  }
}

// ===========================================================
// 🟡 Toggle Details
// ===========================================================
function toggleDetails(p) {
  p.showDetails = !p.showDetails;
}

// ===========================================================
// ☁️ Cloudinary URL Formatter
// ===========================================================
function formatImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("https://res.cloudinary.com") || path.startsWith("http")) {
    return path;
  }
  return `${API_URL}/${path.replace(/^\//, "")}`;
}

// ===========================================================
// ⚠️ Handle Broken Image
// ===========================================================
function handleImageError(event) {
  console.warn("⚠️ Broken image:", event.target.src);
  event.target.src = "/default-property.jpg";
}

// ===========================================================
// 📅 Format Date
// ===========================================================
function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
.page {
  padding: 20px;
}

.filter-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-form select,
.filter-form button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.property-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.property-card {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.thumb {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ccc;
}

.details-btn {
  background: #f5f5f5;
  color: black;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.details-btn:hover {
  background: orange;
}

.details {
  margin-top: 10px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px;
}

.merchant-info {
  margin-top: 10px;
  background: #eef5ff;
  padding: 8px;
  border-radius: 6px;
}

.booking-info {
  margin-top: 10px;
  background: #f1fff3;
  padding: 8px;
  border-radius: 6px;
}

.no-bookings {
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}

.loading,
.error {
  text-align: center;
}

.error {
  color: red;
}
</style>

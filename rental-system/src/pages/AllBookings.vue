<template>
  <div class="page">
    <h2>{{ $t("bookings.title") }}</h2>

    <!-- Loading and Error -->
    <div v-if="loading" class="loading">{{ $t("bookings.loading") }}</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Bookings Grouped by Merchant -->
    <div v-if="groupedBookings && Object.keys(groupedBookings).length">
      <div
        v-for="(bookings, merchantEmail) in groupedBookings"
        :key="merchantEmail"
        class="merchant-section"
      >
        <h3>{{ $t("bookings.merchant") }}: {{ merchantEmail }}</h3>

        <table class="booking-table">
          <thead>
            <tr>
              <th>{{ $t("bookings.propertyName") }}</th>
              <th>{{ $t("bookings.merchantPhone") }}</th>
              <th>{{ $t("bookings.businessName") }}</th>
              <th>{{ $t("bookings.startDate") }}</th>
              <th>{{ $t("bookings.endDate") }}</th>
              <th>{{ $t("bookings.numberOfProperty") }}</th>
              <th>{{ $t("bookings.actions") }}</th>
            </tr>
          </thead>

          <tbody>
            <!-- Loop through bookings -->
            <template v-for="(b, i) in bookings" :key="i">
              <tr>
                <td>{{ b.propertyName }}</td>
                <td>{{ b.merchantPhone }}</td>
                <td>{{ b.businessName }}</td>
                <td>{{ formatDate(b.startDate) }}</td>
                <td>{{ formatDate(b.endDate) }}</td>
                <td>{{ b.numberOfProperty }}</td>
                <td>
                  <button
                    class="toggle-btn"
                    @click="toggleDetails(merchantEmail, i)"
                  >
                    {{
                      showDetails[merchantEmail]?.[i]
                        ? $t("bookings.hide")
                        : $t("bookings.details")
                    }}
                  </button>
                </td>
              </tr>

              <!-- Animated detail section -->
              <transition name="fade">
                <tr
                  v-if="showDetails[merchantEmail]?.[i]"
                  class="details-row"
                >
                  <td colspan="7">
                    <div class="details">
                      <p>
                        <b>{{ $t("bookings.paymentProof") }}:</b>
                        {{ b.paymentProofPath || "-" }}
                      </p>
                      <div
                        class="image-gallery"
                        v-if="b.imageUrls && b.imageUrls.length"
                      >
                        <img
                          v-for="img in b.imageUrls"
                          :key="img"
                          :src="formatImageUrl(img)"
                          alt="Property"
                          class="thumb"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </transition>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No bookings -->
    <div v-else-if="!loading && !error">
      {{ $t("bookings.noBookings") }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

const bookings = ref([]);
const loading = ref(false);
const error = ref("");
const showDetails = ref({});

// Fetch all bookings
async function getAllBookings() {
  loading.value = true;
  const lang = localStorage.getItem("lang") || "en";

  try {
    const res = await axios.get(`${API_URL}/customer/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { lang },
    });

    bookings.value = res.data.bookings || [];
    const grouped = groupByMerchant(bookings.value);

    // Initialize detail toggles
    Object.keys(grouped).forEach((email) => {
      showDetails.value[email] = grouped[email].map(() => false);
    });
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load bookings.";
  } finally {
    loading.value = false;
  }
}

// Group bookings by merchant email
function groupByMerchant(data) {
  const grouped = {};
  data.forEach((b) => {
    if (!grouped[b.merchantEmail]) grouped[b.merchantEmail] = [];
    grouped[b.merchantEmail].push(b);
  });
  return grouped;
}

const groupedBookings = computed(() => groupByMerchant(bookings.value));

// Toggle detail visibility
function toggleDetails(merchantEmail, index) {
  showDetails.value[merchantEmail][index] =
    !showDetails.value[merchantEmail][index];
}

// Format image URL
function formatImageUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_URL}/${path}`;
}

// Format date for display
function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString();
}

onMounted(getAllBookings);
</script>

<style scoped>
.page {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.merchant-section {
  margin-bottom: 40px;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.booking-table th,
.booking-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.booking-table th {
  background-color: #d3d3d3;
  color: black;
  font-weight: bold;
}

.booking-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.toggle-btn {
  background: wheat;
  color: black;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.toggle-btn:hover {
  background: gray;
  color: white;
}

.details-row td {
  background: #fffaf0;
}

.details {
  margin-top: 8px;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.thumb {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ccc;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
}

.error {
  color: red;
}

/* Smooth fade animation for details */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>

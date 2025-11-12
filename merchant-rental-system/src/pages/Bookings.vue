<template>
  <div class="booking-list-page">
    <h1 class="page-title">{{ t('bookings.title') }}</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ t('bookings.loading') }}</p>
    </div>

    <!-- Booking Grid -->
    <div v-if="!loading && bookings.length" class="bookings-grid">
      <div v-for="booking in bookings" :key="booking.bookingId" class="booking-card">
        <div class="booking-info">
          <h2>{{ booking.propertyName }}</h2>
          <p><strong>{{ t('bookings.columns.customer') }}:</strong> {{ booking.customerName }}</p>
          <p><strong>{{ t('bookings.columns.totalPrice') }}:</strong> {{ booking.totalPrice }}</p>
          <p>
            <strong>{{ t('bookings.columns.status') }}:</strong>
            <select
              v-model="booking.status"
              @change="updateBookingStatus(booking)"
              class="status-select"
            >
              <option value="pending">{{ t('bookings.statusOptions.pending') }}</option>
              <option value="confirmed">{{ t('bookings.statusOptions.confirmed') }}</option>
              <option value="completed">{{ t('bookings.statusOptions.completed') }}</option>
              <option value="cancelled">{{ t('bookings.statusOptions.cancelled') }}</option>
            </select>
          </p>
          <div class="actions">
            <button @click="openBookingDetails(booking)" class="details-btn">
              {{ t('bookings.actions.details') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Bookings -->
    <div v-else-if="!loading && !bookings.length" class="no-data">
      {{ t('bookings.noBookings') }}
    </div>

    <!-- Booking Details Modal -->
    <div v-if="selectedBooking" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedBooking.propertyName }}</h2>
        <div class="details-section">
          <p><strong>{{ t('bookings.columns.customer') }}:</strong> {{ selectedBooking.customerName }}</p>
          <p><strong>{{ t('bookings.columns.email') }}:</strong> {{ selectedBooking.customerEmail }}</p>
          <p><strong>{{ t('bookings.columns.phone') }}:</strong> {{ selectedBooking.customerPhone || '—' }}</p>
          <p>
            <strong>{{ t('bookings.columns.dates') }}:</strong>
            {{ formatDate(selectedBooking.startDate) }} → {{ formatDate(selectedBooking.endDate) }}
          </p>
          <p><strong>{{ t('bookings.columns.status') }}:</strong> {{ selectedBooking.status }}</p>
          <p><strong>{{ t('bookings.columns.totalPrice') }}:</strong> {{ selectedBooking.totalPrice }}</p>
          <p><strong>{{ t('bookings.columns.numberOfProperties') }}:</strong> {{ selectedBooking.numberOfProperty }}</p>
        </div>

        <!-- Payment Proof -->
        <div class="payment-proof">
          <h3>{{ t('bookings.columns.paymentProof') }}</h3>
          <img
            v-if="selectedBooking.paymentProofPath"
            :src="getImageUrl(selectedBooking.paymentProofPath)"
            alt="Payment Proof"
            class="modal-img"
          />
          <p v-else class="text-gray-400 italic">{{ t('bookings.noPaymentProof') }}</p>
        </div>

        <div class="modal-actions">
          <button
            @click="deleteBooking(selectedBooking.bookingId); selectedBooking = null"
            class="delete-btn"
          >
            {{ t('bookings.actions.delete') }}
          </button>
          <button @click="selectedBooking = null" class="close-btn">
            {{ t('bookings.actions.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t } = useI18n()

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/merchant'
const CLOUD_BASE_URL = import.meta.env.VITE_CLOUD_URL || 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload'
const token = localStorage.getItem('merchantToken')

const bookings = ref([])
const loading = ref(true)
const selectedBooking = ref(null)

const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400x250.png?text=No+Image'
  return url.startsWith('http') ? url : `${CLOUD_BASE_URL}/${url.replace(/\\/g, '/')}`
}

const fetchBookings = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/operations/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    bookings.value = res.data.bookings || []
  } catch (err) {
    console.error('Error fetching bookings:', err.response?.data || err.message)
  } finally {
    loading.value = false
  }
}

const openBookingDetails = (booking) => {
  selectedBooking.value = booking
}

const updateBookingStatus = async (booking) => {
  try {
    await axios.patch(`${API_BASE_URL}/operations/bookings/${booking.bookingId}/status`, {
      status: booking.status,
    }, { headers: { Authorization: `Bearer ${token}` } })
  } catch (err) {
    console.error('Failed to update status:', err.response?.data || err.message)
  }
}

const deleteBooking = async (id) => {
  if (!confirm(t('bookings.actions.deleteConfirm'))) return
  try {
    await axios.delete(`${API_BASE_URL}/operations/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    bookings.value = bookings.value.filter(b => b.bookingId !== id)
  } catch (err) {
    console.error('Failed to delete booking:', err.response?.data || err.message)
  }
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '—'

onMounted(fetchBookings)
</script>

<style scoped>
.booking-list-page {
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}
.page-title {
  font-size: 1.8rem;
  color: #1e3a8a;
  font-weight: 700;
  margin-bottom: 1rem;
}
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.booking-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  padding: 1rem;
}
.booking-card:hover { transform: translateY(-4px); }
.booking-info h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.status-select {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.actions {
  margin-top: 0.6rem;
}
.details-btn {
  background-color: #2563eb;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}
.details-btn:hover { opacity: 0.9; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 460px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-img {
  width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}
.details-section {
  margin-bottom: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.delete-btn { background-color: #ef4444; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; }
.close-btn { background-color: #6b7280; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; }

.spinner {
  border: 3px solid #ddd;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.no-data { text-align: center; margin-top: 2rem; font-size: 1.1rem; color: #6b7280; }
</style>

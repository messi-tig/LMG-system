<template>
  <div class="dashboard">
    <h2 class="title">Admin Dashboard</h2>

    <div class="stats-grid">
      <!-- Merchants -->
      <div class="stat-card">
        <p class="stat-label">Total Merchants</p>
        <p class="stat-value">{{ totalMerchants }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Active Merchants</p>
        <p class="stat-value">{{ activeMerchants }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Suspended Merchants</p>
        <p class="stat-value">{{ suspendedMerchants }}</p>
      </div>

      <!-- Customers -->
      <div class="stat-card">
        <p class="stat-label">Total Customers</p>
        <p class="stat-value">{{ totalCustomers }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Active Customers</p>
        <p class="stat-value">{{ activeCustomers }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Suspended Customers</p>
        <p class="stat-value">{{ suspendedCustomers }}</p>
      </div>

      <!-- Bookings -->
      <div class="stat-card">
        <p class="stat-label">Total Bookings</p>
        <p class="stat-value">{{ totalBookings }}</p>
      </div>

      <!-- Booking statuses -->
     <!-- Booking Statuses -->
<div class="stat-card">
  <p class="stat-label">Decline Bookings</p>
  <p class="stat-value">{{ bookingStatuses.decline || 0 }}</p>
</div>

<div class="stat-card">
  <p class="stat-label">Accepted Bookings</p>
  <p class="stat-value">{{ bookingStatuses.accepted || 0 }}</p>
</div>

<div class="stat-card">
  <p class="stat-label">Pending Bookings</p>
  <p class="stat-value">{{ bookingStatuses.pending || 0 }}</p>
</div>

<div class="stat-card">
  <p class="stat-label">Confirmed Bookings</p>
  <p class="stat-value">{{ bookingStatuses.confirmed || 0 }}</p>
</div>

<div class="stat-card">
  <p class="stat-label">Cancelled Bookings</p>
  <p class="stat-value">{{ bookingStatuses.cancelled || 0 }}</p>
</div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const totalMerchants = ref(0);
    const activeMerchants = ref(0);
    const suspendedMerchants = ref(0);

    const totalCustomers = ref(0);
    const activeCustomers = ref(0);
    const suspendedCustomers = ref(0);

    const totalBookings = ref(0);
    const bookingStatuses = ref({});

    // Fixed statuses to display
    const bookingStatusList = ['decline', 'accepted', 'pending', 'confirmed', 'cancelled'];

    onMounted(async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('managerToken');

        // -----------------------------
        // 1️⃣ Merchants
        // -----------------------------
        const merchantsRes = await axios.get('https://lmgtech-4.onrender.com/merchant/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const merchants = merchantsRes.data || [];
        totalMerchants.value = merchants.length;
        activeMerchants.value = merchants.filter(m => m.isActive).length;
        suspendedMerchants.value = merchants.filter(m => !m.isActive).length;

        // -----------------------------
        // 2️⃣ Customers
        // -----------------------------
        const customersRes = await axios.get('https://lmgtech-4.onrender.com/customer/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const customers = customersRes.data?.customers || [];
        totalCustomers.value = customers.length;
        activeCustomers.value = customers.filter(c => c.isActive).length;
        suspendedCustomers.value = customers.filter(c => !c.isActive).length;

        // -----------------------------
        // 3️⃣ Bookings
        // -----------------------------
        const bookingsRes = await axios.get('https://lmgtech-4.onrender.com/customer/bookings/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bookings = bookingsRes.data?.bookings || [];
        totalBookings.value = bookings.length;

        // Count bookings by each fixed status
        const statusCounts = { decline: 0, accepted: 0, pending: 0, confirmed: 0, cancelled: 0 };
        bookings.forEach(b => {
          const status = b.status?.toLowerCase();
          if (status && statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });
        bookingStatuses.value = statusCounts;

      } catch (error) {
        console.error('Dashboard Fetch Error:', error.response?.data || error);
      }
    });

    return {
      totalMerchants,
      activeMerchants,
      suspendedMerchants,
      totalCustomers,
      activeCustomers,
      suspendedCustomers,
      totalBookings,
      bookingStatuses,
      bookingStatusList
    };
  },
  filters: {
    capitalize: str => str.charAt(0).toUpperCase() + str.slice(1)
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 25px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.stat-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 16px;
  color: #444;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-top: 8px;
}
</style>

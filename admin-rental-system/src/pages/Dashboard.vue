<template>
  <div class="dashboard">
    <h2 class="title">Admin Dashboard</h2>

    <div class="stats-grid">
      <!-- Merchants -->
      <div class="stat-card merchant-total">
        <p class="stat-label">Total Merchants</p>
        <p class="stat-value">{{ totalMerchants }}</p>
      </div>
      <div class="stat-card merchant-active">
        <p class="stat-label">Active Merchants</p>
        <p class="stat-value">{{ activeMerchants }}</p>
      </div>
      <div class="stat-card merchant-suspended">
        <p class="stat-label">Suspended Merchants</p>
        <p class="stat-value">{{ suspendedMerchants }}</p>
      </div>

      <!-- Customers -->
      <div class="stat-card customer-total">
        <p class="stat-label">Total Customers</p>
        <p class="stat-value">{{ totalCustomers }}</p>
      </div>
      <div class="stat-card customer-active">
        <p class="stat-label">Active Customers</p>
        <p class="stat-value">{{ activeCustomers }}</p>
      </div>
      <div class="stat-card customer-suspended">
        <p class="stat-label">Suspended Customers</p>
        <p class="stat-value">{{ suspendedCustomers }}</p>
      </div>

      <!-- Bookings -->
      <div class="stat-card booking-total">
        <p class="stat-label">Total Bookings</p>
        <p class="stat-value">{{ totalBookings }}</p>
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

    const bookingStatusList = ['decline', 'accepted', 'pending', 'confirmed', 'cancelled'];

    onMounted(async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('managerToken');

        // Merchants
        const merchantsRes = await axios.get('https://lmgtech-4.onrender.com/merchant/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const merchants = merchantsRes.data || [];
        totalMerchants.value = merchants.length;
        activeMerchants.value = merchants.filter(m => m.isActive).length;
        suspendedMerchants.value = merchants.filter(m => !m.isActive).length;

        // Customers
        const customersRes = await axios.get('https://lmgtech-4.onrender.com/customer/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const customers = customersRes.data?.customers || [];
        totalCustomers.value = customers.length;
        activeCustomers.value = customers.filter(c => c.isActive).length;
        suspendedCustomers.value = customers.filter(c => !c.isActive).length;

        // Bookings
        const bookingsRes = await axios.get('https://lmgtech-4.onrender.com/customer/bookings/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bookings = bookingsRes.data?.bookings || [];
        totalBookings.value = bookings.length;

        const statusCounts = { decline: 0, accepted: 0, pending: 0, confirmed: 0, cancelled: 0 };
        bookings.forEach(b => {
          const status = b.status?.toLowerCase();
          if (status && statusCounts.hasOwnProperty(status)) statusCounts[status]++;
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
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: white;
}

/* Merchants */
.merchant-total { background: #4f46e5; }
.merchant-active { background: #10b981; }
.merchant-suspended { background: #ef4444; }

/* Customers */
.customer-total { background: #6366f1; }
.customer-active { background: #22c55e; }
.customer-suspended { background: #f43f5e; }

/* Bookings */
.booking-total { background: #f59e0b; }

.stat-label {
  font-size: 16px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-top: 8px;
}
</style>

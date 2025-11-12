<template>
  <div class="dashboard">
    <h1 class="dashboard-title">{{ $t('dashboard.welcome', { name: merchantName }) }}</h1>
    <p class="dashboard-subtitle">{{ $t('dashboard.overview') }}</p>

    <div class="cards-container">
      <!-- Total Properties -->
      <div class="card card-blue">
        <div class="card-icon">🏢</div>
        <div class="card-content">
          <h2>{{ totalProperties }}</h2>
          <p>{{ $t('dashboard.totalProperties') }}</p>
        </div>
      </div>

      <!-- Active Rentals -->
      <div class="card card-green">
        <div class="card-icon">🔑</div>
        <div class="card-content">
          <h2>{{ activeRentals }}</h2>
          <p>{{ $t('dashboard.activeRentals') }}</p>
        </div>
      </div>

      <!-- Revenue This Month -->
      <div class="card card-yellow">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <h2>{{ revenueThisMonth }}</h2>
          <p>{{ $t('dashboard.revenueThisMonth') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const merchantName = ref('')
const totalProperties = ref(0)
const activeRentals = ref(0)
const revenueThisMonth = ref(0)

onMounted(async () => {
  const merchant = JSON.parse(localStorage.getItem('merchant'))
  merchantName.value = merchant?.name || 'Merchant'

  try {
    const token = localStorage.getItem('merchantToken')
    const { data } = await axios.get('http://localhost:3000/merchant/operations/properties', {
      headers: { Authorization: `Bearer ${token}` }
    })

    totalProperties.value = data.total || data.properties.length
    activeRentals.value = data.properties.filter(p => p.status === 'active').length
    revenueThisMonth.value = data.properties.reduce((sum, p) => sum + (p.revenueThisMonth || 0), 0)
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e3a8a;
}

.dashboard-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Cards Container */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* Card Styles */
.card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 15px;
  color: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12);
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.card-content h2 {
  font-size: 1.8rem;
  margin: 0;
}

.card-content p {
  margin: 0;
  font-weight: 500;
}

/* Card Colors */
.card-blue { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
.card-green { background: linear-gradient(135deg, #10b981, #047857); }
.card-yellow { background: linear-gradient(135deg, #f59e0b, #b45309); }
</style>

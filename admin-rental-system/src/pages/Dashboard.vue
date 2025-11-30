<template>
  <div class="dashboard">

    <!-- ======= Stats Cards ======= -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <p class="stat-label">{{ stat.label }}</p>
        <p class="stat-value">{{ stat.value }}</p>
      </div>
    </div>

    <!-- ======= Recent Customers ======= -->
    <div class="recent-customers">
      <h3>Recent Customers</h3>
      <ul>
        <li
          v-for="customer in recentCustomers"
          :key="customer._id"
          class="customer-item"
        >
          <div class="customer-info">
            <div
              class="customer-initial"
              :style="{ backgroundColor: customer.color }"
            >
              {{ customer.initial }}
            </div>
            <span class="customer-name">{{ customer.fullName }}</span>
          </div>
          <span class="customer-time">
            {{ formatDate(customer.createdAt) }}
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "@/utils/Api";   // admin API instance
import adminApi from "@/utils/booking"; // customer API instance

// ===================== STATE =====================
const stats = ref([
  { label: "Total Customers", value: 0 },
  { label: "Total Merchants", value: 0 },
  { label: "Total Bookings", value: 0 },
  { label: "Bookings Today", value: 0 },
  { label: "Revenue", value: "$0" },
]);

const recentCustomers = ref([]);

// ===================== FETCH STATS =====================
const fetchStats = async () => {
  try {
    const res = await api.get("/stats");
    stats.value = [
      { label: "Total Customers", value: res.data.totalCustomers },
      { label: "Total Merchants", value: res.data.totalMerchants },
      { label: "Total Bookings", value: res.data.totalBookings },
      { label: "Bookings Today", value: res.data.bookingsToday },
      { label: "Revenue", value: `$${res.data.revenue}` },
    ];
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
};

// ===================== FETCH RECENT CUSTOMERS =====================
const fetchRecentCustomers = async () => {
  try {
    const res = await adminApi.get("/customers/recent");

    recentCustomers.value = res.data.customers.map((c) => ({
      ...c,
      initial: c.fullName[0].toUpperCase(),
      color: getRandomColor(),
    }));
  } catch (err) {
    console.error("Error fetching recent customers:", err);
  }
};

// Avatar color generator
const getRandomColor = () => {
  const colors = ["#4f46e5", "#10b981", "#8b5cf6", "#ec4899", "#f97316"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Format date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return (
    date.toLocaleDateString() + " — " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

// Load on mount
onMounted(() => {
  fetchStats();
  fetchRecentCustomers();
});
</script>

<style scoped>.dashboard {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #111;
}

/* ===== Stats Grid ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
  word-wrap: break-word;
}

/* ===== Recent Customers ===== */
.recent-customers {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.recent-customers h3 {
  margin-bottom: 12px;
  font-weight: 600;
}

.customer-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  transition: 0.2s;
}
.customer-item:hover {
  background: #f3f4f6;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-initial {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.customer-name {
  font-weight: 500;
}

.customer-time {
  font-size: 13px;
  color: #6b7280;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  /* Stats Grid adjusts to 2 columns */
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .stat-card {
    padding: 14px;
  }
  .stat-value {
    font-size: 22px;
  }

  /* Recent Customers stacked layout */
  .customer-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .customer-time {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  /* Stats Grid single column on small phones */
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .stat-card {
    padding: 12px;
  }
  .stat-value {
    font-size: 20px;
  }
  .recent-customers {
    padding: 12px;
  }
}

</style>

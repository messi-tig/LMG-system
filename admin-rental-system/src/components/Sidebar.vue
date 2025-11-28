<template>
  <aside :class="['sidebar', { closed: !isOpen }]">
    <div class="sidebar-header">
      <h2>{{ $t('dashboard.title') }}</h2>
    </div>

    <nav class="menu">
      <router-link to="/dashboard" class="menu-item">
        <span class="icon">🏠</span>
        <span>{{ $t('dashboard.title') }}</span>
      </router-link>
      <router-link to="/merchant-list" class="menu-item">
        <span class="icon">📦</span>
        <span>{{ $t('merchantList.title') }}</span>
      </router-link>

      <router-link to="/customer-list" class="menu-item">
        <span class="icon">👥</span>
        <span>{{ $t('customer.listTitle') }}</span>
      </router-link>
         <router-link to="/booking-list" class="menu-item">
        <span class="icon">📅</span>
        <span>{{ $t('bookingList.title') }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, default: true }
});
</script>

<style scoped>
.sidebar {
  z-index: 50 !important;
  position: relative;
}

.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  min-height: 100vh;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* Sidebar closed state */
.closed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.sidebar-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  text-align: center;
}

.sidebar-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #374151;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #374151;
  font-size: 0.96rem;
  font-weight: 500;
  transition: all 0.25s ease;
}

.icon {
  font-size: 1.2rem;
  width: 22px;
  text-align: center;
}

.menu-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.menu-item.router-link-active {
  background: #e0f2fe;
  color: #0284c7;
  font-weight: 600;
  transform: translateX(4px);
}

/* DARK MODE */
.dark .sidebar {
  background: #1f2937;
  border-color: #374151;
}

.dark .sidebar-header h2 {
  color: #f3f4f6;
}

.dark .menu-item {
  color: #e5e7eb;
}

.dark .menu-item:hover {
  background: #374151;
}

.dark .menu-item.router-link-active {
  background: #0ea5e9;
  color: white;
}
</style>

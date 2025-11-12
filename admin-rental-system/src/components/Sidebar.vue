<template>
  <aside class="sidebar bg-white shadow-lg w-64 p-4 flex flex-col gap-4">
    <router-link to="/dashboard" class="nav-link">{{ $t('dashboard.title') }}</router-link>
    <router-link to="/merchant-register" class="nav-link">{{ $t('merchant.title') }}</router-link>
    <router-link to="/users" class="nav-link">{{ $t('users') }}</router-link>
    <router-link to="/settings" class="nav-link">{{ $t('settings') }}</router-link>
  </aside>
</template>

<style scoped>
.sidebar {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.nav-link.router-link-active {
  font-weight: bold;
  background-color: #e0f2fe;
}
.nav-link:hover {
  background-color: #dbeafe;
}
</style>

import { createRouter, createWebHistory } from 'vue-router'

// Layout
import MainLayout from '@/layouts/MainLayout.vue'

// Pages
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import PropertyList from '@/pages/PropertyList.vue'
import AddProperty from '@/pages/AddProperty.vue'
import Bookings from '@/pages/Bookings.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
  // Public route
  { path: '/login', name: 'Login', component: Login },

  // Protected main layout
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'Dashboard' } },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'properties', name: 'PropertyList', component: PropertyList },
      { path: 'properties/add', name: 'AddProperty', component: AddProperty },
      { path: 'bookings', name: 'Bookings', component: Bookings },
      { path: 'profile', name: 'Profile', component: Profile },
    ],
  },

  // Catch-all redirect
  { path: '/:catchAll(.*)', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('merchantToken')
  if (to.meta.requiresAuth && !token) next({ name: 'Login' })
  else if (to.name === 'Login' && token) next({ name: 'Dashboard' })
  else next()
})

export default router

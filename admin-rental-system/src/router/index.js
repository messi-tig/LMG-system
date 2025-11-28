import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'

const isAuthenticated = () => !!localStorage.getItem('adminToken')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },

    // Public routes
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => isAuthenticated() ? next('/dashboard') : next()
    },
    {
      path: '/register',
      component: Register,
      beforeEnter: (to, from, next) => isAuthenticated() ? next('/dashboard') : next()
    },

    // Protected admin layout
   {
  path: '/',
  component: () => import('@/layouts/AdminLayout.vue'),
  beforeEnter: (to, from, next) => isAuthenticated() ? next() : next('/login'),
  children: [
    { path: 'dashboard', component: () => import('@/pages/Dashboard.vue') },
    { path: 'merchant-list', component: () => import('@/pages/MerchantList.vue') },
    { path: 'customer-list', component: () => import('@/pages/CustomerList.vue') },
    { path: 'booking-list', component: () => import('@/pages/BookingList.vue') },
  ]
}
,

    // Fallback
    { path: '/:pathMatch(.*)*', redirect: '/login' }
  ]
})

export default router

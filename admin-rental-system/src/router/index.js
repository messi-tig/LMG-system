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
        { path: 'merchant-register', component: () => import('@/pages/MerchantRegister.vue') },
        { path: 'users', component: () => import('@/pages/Users.vue') },
        { path: 'settings', component: () => import('@/pages/Settings.vue') },
      ]
    },

    // Fallback
    { path: '/:pathMatch(.*)*', redirect: '/login' }
  ]
})

export default router

import { createRouter, createWebHistory } from "vue-router";

// Import pages
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import BookingPage from "../pages/BookingPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";

import CustomerProfile from "../pages/CustomerProfile.vue"; // ✅ Profile page

import MyBookingsPage from "../pages/CustomerBookings.vue";
import AllBookingsPage from "../pages/AllBookings.vue";
import PropertyPage from "../pages/CustomerProperties.vue";
// Import layout
import DashboardLayout from "../layout/DashboardLayout.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/app",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardPage,
      },
      {
        path: "booking",
        name: "Booking",
        component: BookingPage,
      },
      {
        path: "property",
        name: "Property",
        component: PropertyPage,
      },
       {
        path: "profile",
        name: "profile",
        component: CustomerProfile,
      },
      {
        path: "my-bookings",
        name: "MyBookings",
        component: MyBookingsPage,
      },
      {
        path: "all-bookings",
        name: "AllBookings",
        component: AllBookingsPage,
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) next("/login");
  else if ((to.path === "/login" || to.path === "/register") && token)
    next("/app/dashboard");
  else next();
});

export default router;

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
    <p class="text-gray-700">
      This is the protected dashboard page. You can only access it after login.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Optional: redirect if user is not logged in
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  }
});
</script>
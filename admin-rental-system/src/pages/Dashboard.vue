<template>
  <div class="dashboard">

    <p>Welcome to your admin dashboard.</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const logout = () => {
  localStorage.removeItem('adminToken'); // remove token
  router.push('/login'); // back to login page
};
</script>

<style scoped>

button {
  background: #fff;
  color: #007bff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #f0f0f0;
}
</style>

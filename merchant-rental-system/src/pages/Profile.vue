<template>
  <MainLayout>
    <div class="profile-page">
      <h1>{{ $t('profile.title') }}</h1>
      <div class="profile-card">
        <p><strong>{{ $t('profile.name') }}:</strong> {{ merchant.name }}</p>
        <p><strong>{{ $t('profile.email') }}:</strong> {{ merchant.email }}</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const merchant = ref({ name: '', email: '' });

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('merchant'));
  if (stored) merchant.value = stored;
});
</script>

<style scoped>
.profile-page h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.profile-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

<template>
  <div class="user-search">
    <input v-model="query" @input="$emit('search', query)" :placeholder="$t('search_placeholder')" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
const query = ref('')
</script>
<style scoped>
.user-search input{padding:.5rem 1rem;border-radius:8px;border:1px solid #e5e7eb;width:100%;max-width:320px}
</style>

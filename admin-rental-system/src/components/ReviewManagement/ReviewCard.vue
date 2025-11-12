<template>
  <div class="review-card">
    <div class="top">
      <strong>{{ review.author }}</strong>
      <span class="rating">{{ review.rating }}/5</span>
    </div>
    <div class="text">{{ review.text }}</div>
  <div class="actions"><button @click="$emit('flag', review)">{{ $t('flag') }}</button></div>
  </div>
</template>

<script setup>
const props = defineProps({ review: { type: Object, required: true } })
</script>

<style scoped>
.review-card{padding:.75rem;border:1px solid #eee;border-radius:6px;background:#fff}
.top{display:flex;justify-content:space-between}
.text{margin-top:.5rem;color:#333}
.actions{margin-top:.5rem}
</style>

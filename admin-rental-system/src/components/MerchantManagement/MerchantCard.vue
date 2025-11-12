<template>
  <div class="merchant-card">
    <div class="info">
      <div class="name">{{ merchant.fullname || merchant.name }}</div>
      <div class="meta">{{ merchant.email }}<span v-if="merchant.phone"> · {{ merchant.phone }}</span></div>
    </div>
    <div class="controls">
      <button @click="$emit('edit', merchant)">{{ $t('edit') }}</button>
      <button @click="$emit('delete', merchant)">{{ $t('delete') }}</button>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ merchant: { type: Object, required: true } })
</script>
<style scoped>
.merchant-card{display:flex;justify-content:space-between;align-items:center;padding:.75rem;border:1px solid #eee;border-radius:8px;background:#fff;width:300px}
.name{font-weight:600}
.meta{font-size:.9rem;color:#666}
.status{margin-top:.25rem;font-size:.85rem;padding:.2em .6em;border-radius:6px}
.status.active{background:#e0f7fa;color:#00796b}
.status.pending{background:#fff3e0;color:#f57c00}
.status.suspended{background:#ffebee;color:#c62828}
.controls button{margin-left:.5rem}
</style>

<template>
  <div class="listing-card">
    <div class="left">
      <div class="title">{{ listing.title }}</div>
      <div class="meta">{{ listing.location }}</div>
    </div>
    <div class="right">
      <div class="price">${{ listing.price }}</div>
        <div class="actions">
          <button @click="$emit('edit', listing)">{{ $t('edit') }}</button>
          <button @click="$emit('delete', listing)">{{ $t('delete') }}</button>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ listing: { type: Object, required: true } })
</script>

<style scoped>
.listing-card{display:flex;justify-content:space-between;align-items:center;padding:.75rem;border:1px solid #eee;border-radius:6px;background:#fff;width:340px}
.title{font-weight:600}
.price{font-weight:700}
.actions button{margin-left:.4rem}
</style>

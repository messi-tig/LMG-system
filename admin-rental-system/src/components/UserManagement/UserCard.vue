<template>
  <div class="user-card">
    <div class="info">
      <div class="name">{{ user.name }}</div>
      <div class="meta">{{ user.email }} · {{ user.role }}</div>
    </div>
    <div class="controls">
      <button @click="$emit('edit', user)">{{ $t('edit') }}</button>
      <button @click="$emit('delete', user)">{{ $t('delete') }}</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ user: { type: Object, required: true } })
</script>

<style scoped>
.user-card{display:flex;justify-content:space-between;align-items:center;padding:.75rem;border:1px solid #eee;border-radius:6px;background:#fff;width:260px}
.user-card .name{font-weight:600}
.user-card .meta{font-size:.85rem;color:#666}
.controls button{margin-left:.5rem}
</style>

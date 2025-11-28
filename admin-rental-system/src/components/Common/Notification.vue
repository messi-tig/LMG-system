<template>
  <div class="toast" v-if="visible">
    <div class="toast-inner">
      <strong class="title">{{ title || $t('notice') }}</strong>
      <div class="msg">{{ message }}</div>
      <button class="close" @click="$emit('close')">×</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ title: { type: String, default: '' }, message: { type: String, default: '' }, visible: { type: Boolean, default: true } })
</script>

<style scoped>
.toast{position:fixed;right:1rem;top:1rem;z-index:1200}
.toast-inner{background:#111827;color:#fff;padding:.75rem 1rem;border-radius:8px;box-shadow:0 6px 18px rgba(2,6,23,0.4);display:flex;gap:.6rem;align-items:center}
.title{font-weight:700}
.msg{opacity:.9}
.close{background:transparent;border:0;color:#fff;font-size:1.25rem;cursor:pointer}
</style>

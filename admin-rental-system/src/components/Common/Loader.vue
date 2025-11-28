<template>
  <div class="loader" v-if="visible">
    <svg class="spinner" viewBox="0 0 50 50">
      <circle class="ring" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({ visible: { type: Boolean, default: true } })
</script>

<style scoped>
.loader{display:flex;align-items:center;justify-content:center}
.spinner{width:40px;height:40px;animation:spin 1s linear infinite}
.ring{stroke:#c7d2fe;stroke-linecap:round;stroke-dasharray:89;stroke-dashoffset:60}
@keyframes spin{to{transform:rotate(360deg)}}
</style>

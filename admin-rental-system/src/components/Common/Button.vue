<template>
  <button :class="['btn', variantClass, { disabled } ]" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({ variant: { type: String, default: 'primary' }, disabled: { type: Boolean, default: false } })
const emit = defineEmits(['click'])
const variantClass = props.variant === 'secondary' ? 'btn--secondary' : 'btn--primary'
</script>

<style scoped>
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.6rem 1rem;border-radius:8px;border:0;font-weight:600;cursor:pointer}
.btn--primary{background:#4f46e5;color:#fff}
.btn--secondary{background:#eef2ff;color:#1f2937}
.btn:disabled{opacity:.6;cursor:not-allowed}
</style>

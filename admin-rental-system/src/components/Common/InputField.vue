<template>
  <label class="input-wrap">
    <span class="label-text" v-if="label">{{ label }}</span>
    <input :type="type" v-model="model" :placeholder="placeholder" :disabled="disabled" @input="onInput" />
  </label>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ modelValue: { type: [String,Number], default: '' }, label: { type: String, default: '' }, placeholder: { type: String, default: '' }, type: { type: String, default: 'text' }, disabled: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
const model = ref(props.modelValue)
watch(()=>props.modelValue, v=> model.value = v)
function onInput(e){ emit('update:modelValue', model.value) }
</script>

<style scoped>
.input-wrap{display:flex;flex-direction:column;gap:.25rem}
.label-text{font-size:.85rem;color:#4b5563}
input{padding:.5rem .75rem;border-radius:8px;border:1px solid #e6eef8;background:#fff}
input:disabled{background:#f8fafc}
</style>

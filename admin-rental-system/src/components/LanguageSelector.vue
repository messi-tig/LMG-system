<template>
  <select v-model="current" @change="change" class="px-3 py-1 rounded bg-transparent border dark:border-slate-700 text-sm">
    <option value="en">EN</option>
    <option value="am">AM</option>
    <option value="om">OM</option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const current = ref(localStorage.getItem('locale') || locale.value)
const change = () => { locale.value = current.value; localStorage.setItem('locale', current.value) }
watch(locale, (v)=> current.value = v)
</script>

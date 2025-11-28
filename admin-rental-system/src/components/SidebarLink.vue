<template>
  <router-link :to="to" class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
               :class="{ 'bg-blue-50 dark:bg-slate-800 font-semibold': isActive }">
    <component :is="icon" class="w-5 h-5 text-slate-600 dark:text-slate-200" />
    <span v-if="!collapsed" class="text-sm text-slate-700 dark:text-slate-100">{{ label }}</span>
  </router-link>
</template>

<script setup>
import { useRoute } from 'vue-router'
const props = defineProps({ to: String, label: String, icon: Object, collapsed: Boolean })
const route = useRoute()
const isActive = route.path === props.to
</script>

<style scoped></style>

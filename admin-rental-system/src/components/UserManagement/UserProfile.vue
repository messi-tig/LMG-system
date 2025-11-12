<template>
  <div class="user-profile" v-if="user">
    <h3>{{ user.name }}</h3>
    <div>{{ $t('email') }}: {{ user.email }}</div>
    <div>{{ $t('role_label') }}: {{ user.role }}</div>
    <div>ID: {{ user.id }}</div>
    <button @click="$emit('close')">{{ $t('cancel') }}</button>
  </div>
  <div v-else>{{ $t('no_user_selected') }}</div>
</template>
<script setup>
const props = defineProps({ user: { type: Object, default: null } })
const emit = defineEmits(['close'])
</script>
<style scoped>
.user-profile{background:#fff;padding:1.5rem;border-radius:12px;box-shadow:0 2px 12px rgba(44,62,80,0.08);max-width:340px}
.user-profile h3{margin-bottom:.5rem}
button{margin-top:1rem}
</style>

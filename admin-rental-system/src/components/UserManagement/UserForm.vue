<template>
  <form class="user-form" @submit.prevent="onSubmit">
    <h3>{{ isEdit ? $t('edit_user') : $t('create_user') }}</h3>

    <label>
      {{ $t('name_label') }}
      <input v-model="form.name" required />
    </label>

    <label>
      {{ $t('email') }}
      <input v-model="form.email" type="email" required />
    </label>

    <label>
      {{ $t('role_label') }}
      <select v-model="form.role">
        <option>Admin</option>
        <option>Moderator</option>
        <option>User</option>
      </select>
    </label>

    <div class="actions">
      <button type="submit">{{ $t('save') }}</button>
      <button type="button" @click="$emit('cancel')">{{ $t('cancel') }}</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['save','cancel'])

const isEdit = !!props.modelValue
const form = reactive({ name: '', email: '', role: 'User' })

if (isEdit) Object.assign(form, props.modelValue)

function onSubmit(){
  // basic validation done by required attrs
  emit('save', { ...form })
}
</script>

<style scoped>
.user-form{display:flex;flex-direction:column;gap:.5rem;max-width:360px}
.user-form label{display:flex;flex-direction:column;font-size:.9rem}
.actions{display:flex;gap:.5rem;margin-top:.5rem}
</style>

<template>
  <form class="merchant-form" @submit.prevent="onSubmit">
    <h3>{{ isEdit ? $t('edit_user') : $t('register_merchant') }}</h3>
      <label>
        {{ $t('fullname') || $t('name_label') }}
        <input v-model="form.fullname" required />
      </label>
      <label>
        {{ $t('email') }}
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        {{ $t('phone_optional') || 'Phone (optional)' }}
        <input v-model="form.phone" type="tel" />
      </label>
    <div class="actions">
      <button type="submit">{{ $t('save') }}</button>
      <button type="button" @click="$emit('cancel')">{{ $t('cancel') }}</button>
    </div>
  </form>
</template>
<script setup>
import { reactive } from 'vue'
const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['save','cancel'])
const isEdit = !!props.modelValue
const form = reactive({ fullname: '', email: '', phone: '' })
if (isEdit) Object.assign(form, props.modelValue)
function onSubmit(){ emit('save', { fullname: form.fullname, email: form.email, phone: form.phone }) }
</script>
<style scoped>
.merchant-form{display:flex;flex-direction:column;gap:.5rem;max-width:380px}
.merchant-form label{display:flex;flex-direction:column;font-size:.95rem}
.actions{display:flex;gap:.5rem;margin-top:.5rem}
</style>

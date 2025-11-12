<template>
  <form class="listing-form" @submit.prevent="onSubmit">
    <h3>{{ isEdit ? $t('edit_user') : $t('create_user') }}</h3>

    <label>
      {{ $t('title') || 'Title' }}
      <input v-model="form.title" required />
    </label>

    <label>
      {{ $t('location') || 'Location' }}
      <input v-model="form.location" />
    </label>

    <label>
      {{ $t('price') || 'Price' }}
      <input v-model.number="form.price" type="number" min="0" />
    </label>

    <div class="actions">
      <button type="submit">{{ $t('save') }}</button>
      <button type="button" @click="$emit('cancel')">{{ $t('cancel') }}</button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({ modelValue: { type: Object, default: null } })
const emit = defineEmits(['save','cancel'])
const isEdit = !!props.modelValue
const form = reactive({ title: '', location: '', price: 0 })
if (isEdit) Object.assign(form, props.modelValue)

function onSubmit(){ emit('save', { ...form }) }
</script>

<style scoped>
.listing-form{display:flex;flex-direction:column;gap:.5rem;max-width:380px}
.actions{display:flex;gap:.5rem}
</style>

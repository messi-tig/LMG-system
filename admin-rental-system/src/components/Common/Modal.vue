<template>
  <div class="modal-backdrop" v-if="visible" @click.self="close">
    <div class="modal">
      <header class="modal-head">
  <h3><slot name="title">{{ $t('modal_title') }}</slot></h3>
        <button class="close" @click="close">×</button>
      </header>
      <section class="modal-body"><slot /></section>
      <footer class="modal-foot"><slot name="footer" /></footer>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue','close'])
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
function close(){ visible.value = false; emit('close') }
</script>

<style scoped>
.modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.45);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal{background:#fff;border-radius:12px;max-width:720px;width:94%;box-shadow:0 12px 40px rgba(2,6,23,0.2);overflow:hidden}
.modal-head{display:flex;justify-content:space-between;align-items:center;padding:1rem;border-bottom:1px solid #eef2ff}
.modal-body{padding:1rem}
.modal-foot{padding:0.75rem;border-top:1px solid #f1f5f9;text-align:right}
.close{background:transparent;border:0;font-size:1.25rem;cursor:pointer}
</style>

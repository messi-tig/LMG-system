<template>
  <div class="merchant-list">
  <h2>{{ $t('merchants_title') }}</h2>
  <div v-if="merchants.length===0">{{ $t('no_merchants') || 'No merchants registered.' }}</div>
    <div class="cards">
      <MerchantCard
        v-for="merchant in merchants"
        :key="merchant.id"
        :merchant="merchant"
        @edit="onEdit"
        @delete="onDelete"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import MerchantCard from './MerchantCard.vue'
const merchants = ref([
  { id: 1, fullname: 'Acme Inc.', email: 'acme@merchant.com', phone: '555-0101' },
  { id: 2, fullname: 'Beta LLC', email: 'beta@merchant.com', phone: '' },
])
function onEdit(merchant){ console.log('Edit merchant', merchant) }
function onDelete(merchant){ merchants.value = merchants.value.filter(m => m.id !== merchant.id) }
</script>
<style scoped>
.cards{display:flex;gap:1rem;flex-wrap:wrap}
</style>

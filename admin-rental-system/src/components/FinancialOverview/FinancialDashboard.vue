<template>
  <div class="financial-dashboard">
    <h2>{{ $t('financial_overview') }}</h2>
    <div class="tiles">
        <div class="tile">
          <div class="label">{{ $t('total_revenue') }}</div>
          <div class="value">{{ fmt(totalRevenue) }}</div>
        </div>
        <div class="tile">
          <div class="label">{{ $t('transactions') }}</div>
          <div class="value">{{ transactionsCount }}</div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
const transactions = ref([
  { amount: 250 },
  { amount: 75.5 },
  { amount: 120 },
])

const totalRevenue = computed(()=>transactions.value.reduce((s,t)=>s+(t.amount||0),0))
const transactionsCount = computed(()=>transactions.value.length)

function fmt(v){return '$'+Number(v||0).toFixed(2)}
</script>

<style scoped>
.tiles{display:flex;gap:1rem}
.tile{background:#fff;padding:1rem;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.04);min-width:160px}
.label{color:#666}
.value{font-size:1.25rem;font-weight:700}
</style>

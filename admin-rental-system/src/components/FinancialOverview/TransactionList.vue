<template>
  <div class="transaction-list">
  <h2>{{ $t('transactions_title') }}</h2>
    <table v-if="transactions.length">
      <thead>
        <tr><th>ID</th><th>User</th><th>Amount</th><th>Date</th></tr>
      </thead>
      <tbody>
        <tr v-for="t in transactions" :key="t.id">
          <td>{{ t.id }}</td>
          <td>{{ t.user }}</td>
          <td>{{ formatCurrency(t.amount) }}</td>
          <td>{{ t.date }}</td>
        </tr>
      </tbody>
    </table>
  <div v-else>{{ $t('no_transactions') }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const transactions = ref([
  { id: 'TX1001', user: 'Alice', amount: 250.0, date: '2025-09-12' },
  { id: 'TX1002', user: 'Bob', amount: 75.5, date: '2025-09-13' },
])

function formatCurrency(val){
  return '$' + Number(val || 0).toFixed(2)
}
</script>

<style scoped>
table{width:100%;border-collapse:collapse}
th,td{border-bottom:1px solid #eee;padding:.5rem;text-align:left}
</style>

<template>
  <div class="listing-list">
    <h2>{{ $t('listings_title') }}</h2>
    <div v-if="listings.length===0">{{ $t('no_listings') }}</div>
    <div class="cards">
      <ListingCard
        v-for="l in listings"
        :key="l.id"
        :listing="l"
        @edit="onEdit"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListingCard from './ListingCard.vue'

const listings = ref([
  { id: 1, title: '2BR Apartment', location: 'Downtown', price: 1200 },
  { id: 2, title: 'Cozy Studio', location: 'Midtown', price: 800 },
])

function onEdit(listing){console.log('edit listing', listing)}
function onDelete(listing){listings.value = listings.value.filter(x=>x.id!==listing.id)}
</script>

<style scoped>
.cards{display:flex;gap:1rem;flex-wrap:wrap}
</style>

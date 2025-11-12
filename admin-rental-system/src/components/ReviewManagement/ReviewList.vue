<template>
  <div class="review-list">
  <h2>{{ $t('reviews_title') }}</h2>
  <div v-if="reviews.length===0">{{ $t('no_reviews') }}</div>
    <div class="cards">
      <ReviewCard
        v-for="r in reviews"
        :key="r.id"
        :review="r"
        @flag="onFlag"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReviewCard from './ReviewCard.vue'

const reviews = ref([
  { id: 1, author: 'Carol', rating: 5, text: 'Great!' },
  { id: 2, author: 'Dave', rating: 3, text: 'Okay experience' },
])

function onFlag(r){console.log('Flag review', r)}
</script>

<style scoped>
.cards{display:flex;flex-direction:column;gap:.75rem}
</style>

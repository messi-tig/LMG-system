<template>
  <div class="language-selector">
    <select v-model="currentLang" @change="changeLanguage" class="p-2 border rounded">
      <option value="en">English</option>
      <option value="am">Amharic</option>
      <option value="om">Oromo</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Get i18n instance
const { locale } = useI18n();

// Current language reactive variable
const currentLang = ref(localStorage.getItem('locale') || locale.value);

// Update i18n locale when the selection changes
const changeLanguage = () => {
  locale.value = currentLang.value;
  localStorage.setItem('locale', currentLang.value);
};

// Optional: keep the dropdown synced if locale changes somewhere else
watch(locale, (newLang) => {
  currentLang.value = newLang;
});
</script>

<style scoped>
.language-selector select {
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
}
.language-selector select:focus {
  outline: none;
  border-color: #3b82f6; /* Blue focus ring */
}
</style>

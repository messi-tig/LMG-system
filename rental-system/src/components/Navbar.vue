<template>
  <nav
    style="
      background-color: #1f2937;
      color: white;
      width: 100%;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    "
  >
    <div style="font-size: 20px; font-weight: bold">
      🌍 Welcome to LMG Tech System
    </div>

    <!-- Language selector -->
    <div>
      <label for="lang" style="margin-right: 8px">Language:</label>
      <select
        id="lang"
        v-model="locale"
        @change="changeLanguage"
        style="
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          background-color: white;
          color: #333;
        "
      >
        <option value="en">English</option>
        <option value="am">አማርኛ</option>
        <option value="om">Afaan Oromoo</option>
      </select>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

// When user changes language
const changeLanguage = () => {
  localStorage.setItem("lang", locale.value);
};
</script>

<template>
  <select v-model="selected" @change="changeLang">
    <option value="en">English</option>
    <option value="am">አማርኛ</option>
    <option value="om">Afaan Oromoo</option>
  </select>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      selected: localStorage.getItem('locale') || this.$i18n?.locale || 'en',
    };
  },
  mounted() {
    if (this.$i18n) {
      this.$i18n.locale = this.selected;
    }
  },
  methods: {
    changeLang() {
      if (this.$i18n) {
        this.$i18n.locale = this.selected; // reactive change
      }
      localStorage.setItem('locale', this.selected);
    },
  },
};
</script>

<style scoped>
select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}
select:hover { background: #f3f4f6; }
.dark select {
  background: #374151;
  color: #f3f4f6;
  border-color: #4b5563;
}
</style>

<template>
  <section class="help-section">
    <h2>{{ $t('help.title') }}</h2>
    <p>{{ $t('help.description') }}</p>
    <ul>
      <li>📘 {{ $t('help.contact') }}</li>
      <li>💬 {{ $t('help.faq') }}</li>
      <li>🔗 {{ $t('help.support') }}</li>
    </ul>
  </section>
</template>

<script setup>
</script>

<style scoped>
.help-section {
  background: var(--card-bg, #f9f9f9);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
h2 {
  color: #222;
  margin-bottom: 10px;
}
</style>

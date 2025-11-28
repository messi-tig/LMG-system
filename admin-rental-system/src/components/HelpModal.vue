<template>
  <div class="help-overlay" @click.self="$emit('close')">
    <div class="help-modal">
      <h2>{{ $t('help.title') }}</h2>
      <p>{{ $t('help.description') }}</p>
      <ul>
        <li>{{ $t('help.contact') }}</li>
        <li>{{ $t('help.faq') }}</li>
        <li>{{ $t('help.support') }}</li>
      </ul>
      <button @click="$emit('close')" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.help-modal {
  background: var(--card-bg);
  color: var(--text);
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  text-align: center;
}

.close-btn {
  margin-top: 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  cursor: pointer;
}

.close-btn:hover {
  background: var(--accent-hover);
}
</style>

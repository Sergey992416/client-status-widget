<template>
  <div id="app">
    <ClientDashboard />
  </div>
</template>

<script setup>
import ClientDashboard from './components/ClientDashboard.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* Общие стили для кнопок */
button {
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
}

/* Стили для форм */
input, select, textarea {
  font-family: inherit;
  font-size: 14px;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
}

/* Адаптивность */
@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
}
</style>
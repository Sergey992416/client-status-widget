import { ref, onUnmounted } from 'vue';

export function useInterval(callback, delay) {
  const isActive = ref(false); // Начинаем с выключенного состояния
  let intervalId = null;

  const start = () => {
    if (!isActive.value) {
      isActive.value = true;
      intervalId = setInterval(callback, delay);
    }
  };

  const stop = () => {
    if (isActive.value) {
      isActive.value = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  };

  const toggle = () => {
    if (isActive.value) {
      stop();
    } else {
      start();
    }
  };

  onUnmounted(() => {
    stop();
  });

  return {
    isActive,
    start,
    stop,
    toggle
  };
}
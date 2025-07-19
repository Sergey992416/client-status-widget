<template>
  <div class="notification-system">
    <!-- Toast уведомления -->
    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✓</span>
            <span v-else-if="toast.type === 'info'">ℹ</span>
            <span v-else-if="toast.type === 'warning'">⚠</span>
            <span v-else>!</span>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" @click="removeToast(toast.id)">×</button>
        </div>
      </div>
    </div>

    <!-- Лента уведомлений -->
    <div class="notifications-feed">
      <h3 class="feed-title">Последние события</h3>
      <div class="feed-content">
        <div
          v-for="notification in recentNotifications"
          :key="notification.id"
          class="notification-item"
        >
          <div class="notification-time">
            {{ formatTime(notification.timestamp) }}
          </div>
          <div class="notification-text">
            {{ notification.message }}
          </div>
        </div>
        <div v-if="recentNotifications.length === 0" class="no-notifications">
          Нет уведомлений
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const toasts = ref([]);
const notifications = ref([]);

const recentNotifications = computed(() => {
  return notifications.value.slice(-5).reverse();
});

const showToast = (message, type = 'info') => {
  const toast = {
    id: Date.now(),
    message,
    type
  };
  
  toasts.value.push(toast);
  
  // Автоматическое удаление через 4 секунды
  setTimeout(() => {
    removeToast(toast.id);
  }, 4000);
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const addNotification = (message, type = 'info') => {
  const notification = {
    id: Date.now(),
    message,
    type,
    timestamp: new Date()
  };
  
  notifications.value.push(notification);
  showToast(message, type);
  
  // Ограничиваем количество уведомлений
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(-50);
  }
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Экспорт функций для использования в родительском компоненте
defineExpose({
  addNotification,
  showToast
});
</script>

<style scoped>
.notification-system {
  position: relative;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  min-width: 300px;
  max-width: 500px;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

.toast.success {
  background-color: #4caf50;
  color: white;
}

.toast.info {
  background-color: #2196f3;
  color: white;
}

.toast.warning {
  background-color: #ff9800;
  color: white;
}

.toast.error {
  background-color: #f44336;
  color: white;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 10px;
}

.toast-icon {
  font-size: 18px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.notifications-feed {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.feed-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.feed-content {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-time {
  font-size: 12px;
  color: #999;
  min-width: 50px;
  font-weight: 500;
}

.notification-text {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.no-notifications {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast {
    min-width: auto;
  }
  
  .notifications-feed {
    padding: 15px;
  }
  
  .notification-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .notification-time {
    min-width: auto;
  }
}
</style>
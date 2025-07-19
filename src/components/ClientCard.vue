<template>
  <div class="client-card" :class="statusClass">
    <div class="card-header">
      <h3 class="client-name">{{ client.name }}</h3>
      <div class="status-badge" :class="statusClass">
        {{ statusLabel }}
      </div>
    </div>
    <div class="card-body">
      <p class="last-updated">
        Обновлено: {{ formattedDate }}
      </p>
      <button 
        class="change-status-btn"
        @click="changeStatus"
        :disabled="loading"
      >
        {{ loading ? 'Изменяю...' : 'Сменить статус' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  client: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['status-changed']);

const loading = ref(false);

const statusConfig = {
  active: { label: 'Активен', class: 'status-active' },
  issues: { label: 'Проблемы', class: 'status-issues' },
  completed: { label: 'Завершен', class: 'status-completed' },
  new: { label: 'Новый', class: 'status-new' },
  check: { label: 'Проверка', class: 'status-check' }
};

const statusCycle = ['active', 'issues', 'completed', 'new', 'check'];

const statusLabel = computed(() => {
  return statusConfig[props.client.status]?.label || 'Неизвестно';
});

const statusClass = computed(() => {
  return statusConfig[props.client.status]?.class || '';
});

const formattedDate = computed(() => {
  return new Date(props.client.lastUpdated).toLocaleDateString('ru-RU');
});

const changeStatus = async () => {
  loading.value = true;
  
  // Имитация задержки
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentIndex = statusCycle.indexOf(props.client.status);
  const nextIndex = (currentIndex + 1) % statusCycle.length;
  const newStatus = statusCycle[nextIndex];
  
  emit('status-changed', {
    clientId: props.client.id,
    oldStatus: props.client.status,
    newStatus: newStatus
  });
  
  loading.value = false;
};
</script>

<style scoped>
.client-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid #e0e0e0;
}

.client-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.client-card.status-active {
  border-left-color: #4caf50;
}

.client-card.status-issues {
  border-left-color: #ff9800;
}

.client-card.status-completed {
  border-left-color: #9e9e9e;
}

.client-card.status-new {
  border-left-color: #2196f3;
}

.client-card.status-check {
  border-left-color: #9c27b0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.client-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.status-active {
  background-color: #4caf50;
}

.status-badge.status-issues {
  background-color: #ff9800;
}

.status-badge.status-completed {
  background-color: #9e9e9e;
}

.status-badge.status-new {
  background-color: #2196f3;
}

.status-badge.status-check {
  background-color: #9c27b0;
}

.card-body {
  text-align: center;
}

.last-updated {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.change-status-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
}

.change-status-btn:hover:not(:disabled) {
  background-color: #1976d2;
  transform: translateY(-1px);
}

.change-status-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .client-card {
    padding: 15px;
  }
  
  .client-name {
    font-size: 16px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
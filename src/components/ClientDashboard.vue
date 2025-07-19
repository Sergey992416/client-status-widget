<template>
  <div class="client-dashboard">
    <div class="dashboard-header">
      <h1>Панель управления клиентами</h1>
      <div class="auto-check-controls">
        <button 
          @click="toggleAutoCheck"
          :class="['auto-check-btn', { active: autoCheck.isActive.value }]"
        >
          {{ autoCheck.isActive.value ? 'Остановить проверку' : 'Запустить проверку' }}
        </button>
        <span class="auto-check-status">
          {{ autoCheck.isActive.value ? 'Проверка активна' : 'Проверка отключена' }}
        </span>
      </div>
    </div>

    <ClientFilters 
      :total-clients="clients.length"
      :filtered-count="filteredClients.length"
      @filter-changed="handleFilterChange"
    />

    <NotificationSystem ref="notificationSystem" />

    <div class="clients-grid">
      <ClientCard
        v-for="client in filteredClients"
        :key="client.id"
        :client="client"
        @status-changed="handleStatusChange"
      />
    </div>

    <div v-if="filteredClients.length === 0" class="no-clients">
      <p>Нет клиентов, соответствующих фильтрам</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ClientCard from './ClientCard.vue';
import ClientFilters from './ClientFilters.vue';
import NotificationSystem from './NotificationSystem.vue';
import { useInterval } from '../composables/useInterval.js';
import mockClients from '../assets/mockClients.js';

const clients = ref([]);
const filters = ref({
  search: '',
  statuses: ['active', 'issues', 'completed', 'new', 'check']
});

const notificationSystem = ref(null);

const statusLabels = {
  active: 'Активен',
  issues: 'Проблемы',
  completed: 'Завершен',
  new: 'Новый',
  check: 'Проверка'
};

// Фильтрация клиентов
const filteredClients = computed(() => {
  return clients.value.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchesStatus = filters.value.statuses.includes(client.status);
    return matchesSearch && matchesStatus;
  });
});

// Автоматическая проверка каждые 2 минуты
const autoCheckCallback = () => {
  const activeClients = clients.value.filter(client => client.status !== 'check');
  if (activeClients.length > 0) {
    const randomClient = activeClients[Math.floor(Math.random() * activeClients.length)];
    const oldStatus = randomClient.status;
    
    randomClient.status = 'check';
    randomClient.lastUpdated = new Date().toISOString().split('T')[0];
    
    saveClientsToStorage();
    
    notificationSystem.value?.addNotification(
      `Клиент "${randomClient.name}" переведен в статус "Проверка"`,
      'info'
    );
  }
};

const autoCheck = useInterval(autoCheckCallback, 120000); // 2 минуты

// Обработка изменения статуса
const handleStatusChange = (event) => {
  const client = clients.value.find(c => c.id === event.clientId);
  if (client) {
    client.status = event.newStatus;
    client.lastUpdated = new Date().toISOString().split('T')[0];
    
    saveClientsToStorage();
    
    const oldStatusLabel = statusLabels[event.oldStatus];
    const newStatusLabel = statusLabels[event.newStatus];
    
    notificationSystem.value?.addNotification(
      `Статус "${client.name}" изменен с "${oldStatusLabel}" на "${newStatusLabel}"`,
      'success'
    );
  }
};

// Обработка изменения фильтров
const handleFilterChange = (newFilters) => {
  filters.value = newFilters;
};

// Управление автоматической проверкой
const toggleAutoCheck = () => {
  autoCheck.toggle();
  
  const message = autoCheck.isActive.value 
    ? 'Автоматическая проверка запущена' 
    : 'Автоматическая проверка остановлена';
    
  notificationSystem.value?.addNotification(message, 'info');
};

// Сохранение в localStorage
const saveClientsToStorage = () => {
  localStorage.setItem('clients', JSON.stringify(clients.value));
};

// Загрузка из localStorage
const loadClientsFromStorage = () => {
  const saved = localStorage.getItem('clients');
  if (saved) {
    clients.value = JSON.parse(saved);
  } else {
    clients.value = [...mockClients];
    saveClientsToStorage();
  }
};

// Инициализация
onMounted(() => {
  loadClientsFromStorage();
  
  // Показать приветственное сообщение
  setTimeout(() => {
    notificationSystem.value?.addNotification(
      'Панель управления клиентами загружена',
      'success'
    );
  }, 1000);
});
</script>

<style scoped>
.client-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.auto-check-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auto-check-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auto-check-btn:hover {
  background-color: #1976d2;
}

.auto-check-btn.active {
  background-color: #4caf50;
}

.auto-check-btn.active:hover {
  background-color: #45a049;
}

.auto-check-status {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.no-clients {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

@media (max-width: 768px) {
  .client-dashboard {
    padding: 15px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .dashboard-header h1 {
    font-size: 24px;
  }
  
  .auto-check-controls {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .clients-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
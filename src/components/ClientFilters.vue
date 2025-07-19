<template>
  <div class="client-filters">
    <div class="filters-header">
      <h3>Фильтры и поиск</h3>
      <button class="reset-btn" @click="resetFilters">Сбросить</button>
    </div>
    
    <div class="filters-content">
      <!-- Поиск -->
      <div class="search-section">
        <label for="search">Поиск по названию:</label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Введите название организации..."
          class="search-input"
        />
      </div>
      
      <!-- Фильтры по статусам -->
      <div class="status-filters">
        <label class="filter-label">Статусы:</label>
        <div class="status-checkboxes">
          <label
            v-for="status in availableStatuses"
            :key="status.key"
            class="checkbox-label"
            :class="status.class"
          >
            <input
              v-model="selectedStatuses"
              type="checkbox"
              :value="status.key"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            {{ status.label }}
          </label>
        </div>
      </div>
      
      <!-- Статистика -->
      <div class="filter-stats">
        <div class="stats-item">
          <span class="stats-label">Всего клиентов:</span>
          <span class="stats-value">{{ totalClients }}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">Показано:</span>
          <span class="stats-value">{{ filteredCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  totalClients: {
    type: Number,
    default: 0
  },
  filteredCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['filter-changed']);

const searchQuery = ref('');
const selectedStatuses = ref(['active', 'issues', 'completed', 'new', 'check']);

const availableStatuses = [
  { key: 'active', label: 'Активен', class: 'status-active' },
  { key: 'issues', label: 'Проблемы', class: 'status-issues' },
  { key: 'completed', label: 'Завершен', class: 'status-completed' },
  { key: 'new', label: 'Новый', class: 'status-new' },
  { key: 'check', label: 'Проверка', class: 'status-check' }
];

const resetFilters = () => {
  searchQuery.value = '';
  selectedStatuses.value = ['active', 'issues', 'completed', 'new', 'check'];
};

// Отслеживание изменений фильтров
watch(
  [searchQuery, selectedStatuses],
  () => {
    emit('filter-changed', {
      search: searchQuery.value,
      statuses: selectedStatuses.value
    });
  },
  { deep: true }
);
</script>

<style scoped>
.client-filters {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #e0e0e0;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2196f3;
}

.filter-label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  color: #333;
}

.status-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  transition: color 0.3s ease;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label.status-active .checkbox-custom {
  border-color: #4caf50;
}

.checkbox-label.status-issues .checkbox-custom {
  border-color: #ff9800;
}

.checkbox-label.status-completed .checkbox-custom {
  border-color: #9e9e9e;
}

.checkbox-label.status-new .checkbox-custom {
  border-color: #2196f3;
}

.checkbox-label.status-check .checkbox-custom {
  border-color: #9c27b0;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: currentColor;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label.status-active .checkbox-input:checked + .checkbox-custom {
  background-color: #4caf50;
}

.checkbox-label.status-issues .checkbox-input:checked + .checkbox-custom {
  background-color: #ff9800;
}

.checkbox-label.status-completed .checkbox-input:checked + .checkbox-custom {
  background-color: #9e9e9e;
}

.checkbox-label.status-new .checkbox-input:checked + .checkbox-custom {
  background-color: #2196f3;
}

.checkbox-label.status-check .checkbox-input:checked + .checkbox-custom {
  background-color: #9c27b0;
}

.filter-stats {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-label {
  font-size: 14px;
  color: #666;
}

.stats-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .client-filters {
    padding: 15px;
  }
  
  .filters-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .status-checkboxes {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
<template>
  <div class="dashboard">
    <div v-if="tankStore.loading" class="loading-state">
      <q-spinner-dots size="32px" color="primary" />

      <div class="text-body2 q-mt-sm">Loading tank data...</div>
    </div>

    <div v-else-if="tankStore.error && !tankStore.tank" class="error-state">
      <q-icon name="error_outline" size="40px" />

      <div class="text-body1 q-mt-sm">
        {{ tankStore.error }}
      </div>
    </div>

    <div v-else-if="tankStore.tank" class="tank-card">
      <!-- Header -->
      <div class="tank-header">
        <div>
          <div class="tank-title">
            {{ tankStore.tank.name }}
          </div>

          <div class="tank-id">Tank #{{ tankStore.tank.id.replace('tank-', '') }}</div>
        </div>

        <div class="status-badge" :class="`status-${tankStore.tank.status}`">
          <span class="status-dot" />

          {{ tankStore.tank.status }}
        </div>
      </div>

      <!-- Main content -->
      <div class="tank-content">
        <!-- 3D Viewer -->
        <div class="viewer-section">
          <div class="viewer-container">
            <TankViewer :level="tankStore.tank.level" />
          </div>
        </div>

        <!-- Metrics -->
        <div class="metrics-section">
          <div class="metric">
            <div class="metric-label">LEVEL</div>

            <div class="metric-value">
              {{ tankStore.tank.level }}

              <span class="metric-unit"> % </span>
            </div>

            <q-linear-progress
              :value="tankStore.tank.level / 100"
              rounded
              size="6px"
              class="q-mt-sm"
            />
          </div>

          <div class="metric">
            <div class="metric-label">TEMPERATURE</div>

            <div class="metric-value">
              {{ tankStore.tank.temperature }}

              <span class="metric-unit"> °C </span>
            </div>
          </div>

          <div class="metric">
            <div class="metric-label">PRESSURE</div>

            <div class="metric-value">
              {{ tankStore.tank.pressure }}

              <span class="metric-unit"> bar </span>
            </div>
          </div>

          <div class="metric last-updated">
            <div class="metric-label">LAST UPDATED</div>

            <div class="updated-value">
              {{ formattedTime }}
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="tankStore.tank.alerts.length" class="alerts-section">
        <div
          v-for="alert in tankStore.tank.alerts"
          :key="alert.id"
          class="alert-item"
          :class="`alert-${alert.severity}`"
        >
          <q-icon :name="alert.severity === 'critical' ? 'error' : 'warning'" size="18px" />

          <span>
            {{ alert.message }}
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="tankStore.error" class="error-message">
        <q-icon name="warning" size="18px" />

        {{ tankStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';

import { useTankStore } from '@/stores/tank-store';

import TankViewer from './TankViewer.vue';

const tankStore = useTankStore();

const formattedTime = computed(() => {
  if (!tankStore.tank) {
    return '--';
  }

  return new Date(tankStore.tank.lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

onMounted(() => {
  void tankStore.fetchTank(true);
  tankStore.startPolling();
});

onBeforeUnmount(() => {
  tankStore.stopPolling();
});
</script>

<style scoped>
.dashboard {
  min-height: calc(100vh - 50px);
  padding: 32px;
  background: #f5f7fa;
}

.tank-card {
  max-width: 1100px;
  margin: 0 auto;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.tank-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #eef0f3;
}

.tank-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.tank-id {
  margin-top: 4px;
  font-size: 13px;
  color: #9ca3af;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-normal {
  color: #15803d;
  background: #f0fdf4;
}

.status-normal .status-dot {
  background: #22c55e;
}

.status-warning {
  color: #b45309;
  background: #fffbeb;
}

.status-warning .status-dot {
  background: #f59e0b;
}

.status-critical {
  color: #b91c1c;
  background: #fef2f2;
}

.status-critical .status-dot {
  background: #ef4444;
}

.tank-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  min-height: 500px;
}

.viewer-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 20px;
}

.viewer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 28px 24px;
  background: #fafbfc;
  border-left: 1px solid #eef0f3;
}

.metric {
  padding: 20px 0;
  border-bottom: 1px solid #eef0f3;
}

.metric:first-child {
  padding-top: 0;
}

.metric:last-child {
  border-bottom: none;
}

.metric-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.metric-value {
  margin-top: 7px;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  color: #111827;
}

.metric-unit {
  margin-left: 3px;
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
}

.updated-value {
  margin-top: 7px;
  font-size: 14px;
  color: #4b5563;
}

/* Alerts */

.alerts-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid #eef0f3;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.alert-warning {
  color: #92400e;
  background: #fffbeb;
}

.alert-critical {
  color: #991b1b;
  background: #fef2f2;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  color: #b91c1c;
  background: #fef2f2;
  border-top: 1px solid #fee2e2;
}

.loading-state,
.error-state {
  display: flex;
  min-height: 400px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #6b7280;
}

@media (max-width: 800px) {
  .dashboard {
    padding: 16px;
  }

  .tank-content {
    grid-template-columns: 1fr;
  }

  .metrics-section {
    border-top: 1px solid #eef0f3;
    border-left: none;
  }

  .tank-header {
    padding: 20px;
  }
}
</style>

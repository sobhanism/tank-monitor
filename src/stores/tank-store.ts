import { defineStore } from 'pinia';

import { getTank } from '@/services/tankService';
import { evaluateTank } from '@/services/tankRules';

import type { Tank } from '@/types/tank';

let pollingInterval: ReturnType<typeof setInterval> | null = null;

export const useTankStore = defineStore('tank', {
  state: () => ({
    tank: null as Tank | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchTank(showLoading = false) {
      if (showLoading) {
        this.loading = true;
      }

      this.error = null;

      try {
        const tank = await getTank();

        const evaluation = evaluateTank(tank);

        this.tank = {
          ...tank,
          status: evaluation.status,
          alerts: evaluation.alerts,
        };
      } catch {
        this.error = 'Failed to load tank data.';
      } finally {
        if (showLoading) {
          this.loading = false;
        }
      }
    },

    startPolling() {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }

      pollingInterval = setInterval(() => {
        void this.fetchTank();
      }, 2000);
    },

    stopPolling() {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    },
  },
});

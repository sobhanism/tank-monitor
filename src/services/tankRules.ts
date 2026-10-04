import type { Tank, TankAlert, TankStatus } from '@/types/tank';

export function evaluateTank(tank: Tank): {
  status: TankStatus;
  alerts: TankAlert[];
} {
  const alerts: TankAlert[] = [];

  if (tank.level < 15) {
    alerts.push({
      id: 'low-level-critical',
      message: 'Tank level is critically low.',
      severity: 'critical',
    });
  } else if (tank.level < 30) {
    alerts.push({
      id: 'low-level-warning',
      message: 'Tank level is low.',
      severity: 'warning',
    });
  }

  if (tank.temperature > 40) {
    alerts.push({
      id: 'high-temperature-critical',
      message: 'Tank temperature is critically high.',
      severity: 'critical',
    });
  } else if (tank.temperature > 30) {
    alerts.push({
      id: 'high-temperature-warning',
      message: 'Tank temperature is high.',
      severity: 'warning',
    });
  }

  if (tank.pressure > 3) {
    alerts.push({
      id: 'high-pressure-critical',
      message: 'Tank pressure is critically high.',
      severity: 'critical',
    });
  } else if (tank.pressure > 2.5) {
    alerts.push({
      id: 'high-pressure-warning',
      message: 'Tank pressure is high.',
      severity: 'warning',
    });
  }

  const status: TankStatus = alerts.some((alert) => alert.severity === 'critical')
    ? 'critical'
    : alerts.length > 0
      ? 'warning'
      : 'normal';

  return {
    status,
    alerts,
  };
}

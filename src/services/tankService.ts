import tankData from '@/data/tank.json';
import type { Tank } from '@/types/tank';

let currentLevel = tankData.level;

export async function getTank(): Promise<Tank> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  currentLevel = Math.round((currentLevel + 5) % 101);

  const tank: Tank = {
    id: tankData.id,
    name: tankData.name,
    status: tankData.status as Tank['status'],
    level: currentLevel,
    capacity: tankData.capacity,
    temperature: tankData.temperature,
    pressure: tankData.pressure,
    lastUpdated: new Date().toISOString(),
    alerts: [],
  };

  return tank;
}

export type TankStatus = 'normal' | 'warning' | 'critical';

export interface TankAlert {
  id: string;
  message: string;
  severity: 'warning' | 'critical';
}

export interface Tank {
  id: string;
  name: string;
  status: TankStatus;
  level: number;
  capacity: number;
  temperature: number;
  pressure: number;
  lastUpdated: string;
  alerts: TankAlert[];
}

import { useAppStore } from '../store/useAppStore';

export interface TelemetryEvent {
  timestamp: string;
  playerName: string;
  action: string;
  data?: any;
}

/**
 * Logs a user interaction to help analyze learning paths and game telemetry.
 * Preconfigured to connect to a backend API in the future.
 */
export function logInteraction(action: string, data?: any) {
  const playerName = useAppStore.getState().playerName || 'Anonim';
  
  const event: TelemetryEvent = {
    timestamp: new Date().toISOString(),
    playerName,
    action,
    data,
  };

  // Structured log for future Data Engineers
  console.log('📊 [Telemetry Event]:', JSON.stringify(event, null, 2));

  // Placeholder for future analytics API call:
  // fetch('/api/telemetry', { method: 'POST', body: JSON.stringify(event) }).catch(console.error);
}

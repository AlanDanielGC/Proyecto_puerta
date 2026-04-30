import { AccessLog } from '../types';
import { mockAccessLogs } from '../mock/accessLogs';
import { mockUsers } from '../mock/users';

/**
 * Servicio de logs de acceso
 * Actualmente consume datos mock; en producción se reemplazará con llamadas API REST
 */

// Almacenar logs en memoria (para simular nuevos accesos)
let accessLogs = [...mockAccessLogs];

/**
 * Obtiene todos los logs
 */
export async function getAllLogs(): Promise<AccessLog[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Retornar ordenados por timestamp descendente
  return [...accessLogs].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Obtiene logs filtrados por resultado
 */
export async function getLogsByResult(
  result: 'granted' | 'denied'
): Promise<AccessLog[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  return accessLogs
    .filter(log => log.result === result)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

/**
 * Obtiene logs de un usuario específico
 */
export async function getLogsByUser(userId: string): Promise<AccessLog[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 250));

  return accessLogs
    .filter(log => log.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

/**
 * Obtiene logs de un rango de fechas
 */
export async function getLogsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AccessLog[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const start = startDate.getTime();
  const end = endDate.getTime();

  return accessLogs
    .filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

/**
 * Obtiene logs de un día específico
 */
export async function getLogsByDay(date: Date): Promise<AccessLog[]> {
  // Crear rango para todo el día
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getLogsByDateRange(startOfDay, endOfDay);
}

/**
 * Obtiene logs agrupados por día
 */
export async function getLogsGroupedByDay(): Promise<
  Map<string, AccessLog[]>
> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const grouped = new Map<string, AccessLog[]>();

  const sortedLogs = [...accessLogs].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  sortedLogs.forEach(log => {
    const date = new Date(log.timestamp);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)!.push(log);
  });

  return grouped;
}

/**
 * Obtiene logs de un usuario agrupados por día
 */
export async function getUserLogsGroupedByDay(userId: string): Promise<
  Map<string, AccessLog[]>
> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 250));

  const userLogs = await getLogsByUser(userId);
  const grouped = new Map<string, AccessLog[]>();

  userLogs.forEach(log => {
    const date = new Date(log.timestamp);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)!.push(log);
  });

  return grouped;
}

/**
 * Cuenta intentos fallidos del día actual
 */
export async function countTodayFailedAttempts(): Promise<number> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  return accessLogs.filter(
    log =>
      log.result === 'denied' &&
      new Date(log.timestamp) >= today &&
      new Date(log.timestamp) <= todayEnd
  ).length;
}

/**
 * Obtiene los últimos N logs
 */
export async function getRecentLogs(count: number = 5): Promise<AccessLog[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 250));

  return [...accessLogs]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, count);
}

/**
 * Agrega un nuevo log de acceso (simulando un acceso desde el Arduino)
 */
export async function createAccessLog(
  rfidCode: string,
  result: 'granted' | 'denied',
  deniedReason?: string
): Promise<AccessLog> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Buscar el usuario por RFID
  const user = mockUsers.find(u => u.rfidCode === rfidCode);

  const newLog: AccessLog = {
    id: `log_${Date.now()}`,
    rfidCode,
    userId: user?.id,
    userName: user?.name,
    result,
    deniedReason,
    timestamp: new Date().toISOString(),
  };

  accessLogs.push(newLog);
  return newLog;
}

/**
 * Resetea los logs a los datos mock (para testing)
 */
export function resetLogs(): void {
  accessLogs = [...mockAccessLogs];
}

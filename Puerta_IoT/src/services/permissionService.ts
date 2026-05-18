import { Permission, ScheduledPermission, TemporaryPermission } from '../types';
import { mockPermissions } from '../mock/permissions';

/**
 * Servicio de permisos
 * Actualmente consume datos mock; en producción se reemplazará con llamadas API REST
 */

// Almacenar permisos en memoria (para simular cambios durante la sesión)
let permissions = [...mockPermissions];

/**
 * Obtiene todos los permisos de un usuario
 */
export async function getPermissionsByUser(userId: string): Promise<Permission[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  return permissions.filter(p => p.userId === userId);
}

/**
 * Obtiene todos los permisos (solo activos)
 */
export async function getActivePermissions(): Promise<Permission[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 250));

  return permissions.filter(p => p.active);
}

/**
 * Obtiene un permiso por su ID
 */
export async function getPermissionById(permissionId: string): Promise<Permission | null> {
  // Simular latencia de network
  await new Promise(resolve => setTimeout(resolve, 200));

  return permissions.find(p => p.id === permissionId) || null;
}

/**
 * Crea un nuevo permiso con horario (scheduled)
 */
export async function createScheduledPermission(
  userId: string,
  weekdays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[],
  startTime: string,
  endTime: string
): Promise<ScheduledPermission> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 500));

  const newPermission: ScheduledPermission = {
    id: `perm_${Date.now()}`,
    userId,
    type: 'scheduled',
    weekdays,
    startTime,
    endTime,
    active: true,
    createdAt: new Date().toISOString(),
  };

  permissions.push(newPermission);
  return newPermission;
}

/**
 * Crea un nuevo permiso temporal (temporary)
 */
export async function createTemporaryPermission(
  userId: string,
  maxUses: number,
  validForMinutes: number
): Promise<TemporaryPermission> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 500));

  const now = new Date();
  const expiresAt = new Date(now.getTime() + validForMinutes * 60000);

  const newPermission: TemporaryPermission = {
    id: `perm_${Date.now()}`,
    userId,
    type: 'temporary',
    maxUses,
    usesConsumed: 0,
    validForMinutes,
    expiresAt: expiresAt.toISOString(),
    active: true,
    createdAt: now.toISOString(),
  };

  permissions.push(newPermission);
  return newPermission;
}

/**
 * Elimina (soft delete) un permiso cambiando su estado a inactivo
 */
export async function deletePermission(permissionId: string): Promise<boolean> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const permission = permissions.find(p => p.id === permissionId);
  if (!permission) {
    return false;
  }

  permission.active = false;
  return true;
}

/**
 * Incrementa los usos consumidos de un permiso temporal
 * (se llama cuando se usa un permiso)
 */
export async function incrementTemporaryPermissionUse(
  permissionId: string
): Promise<boolean> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const permission = permissions.find(p => p.id === permissionId);
  if (!permission || permission.type !== 'temporary') {
    return false;
  }

  const tempPerm = permission as TemporaryPermission;
  tempPerm.usesConsumed += 1;

  // Si se consumieron todos los usos, inactivar
  if (tempPerm.usesConsumed >= tempPerm.maxUses) {
    tempPerm.active = false;
  }

  return true;
}

/**
 * Resetea los permisos a los datos mock (para testing)
 */
export function resetPermissions(): void {
  permissions = [...mockPermissions];
}

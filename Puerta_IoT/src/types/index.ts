/**
 * Tipos de usuario
 */
export type UserType = 'student' | 'staff';

/**
 * Interfaz de Usuario
 */
export interface User {
  id: string;
  name: string;
  controlNumber?: string; // Solo alumnos
  rfidCode: string;
  type: UserType;
  department?: string; // Para personal: área o cargo
}

/**
 * Tipos de permiso
 */
export type PermissionType = 'scheduled' | 'temporary';

/**
 * Permiso con horario (scheduled)
 */
export interface ScheduledPermission {
  id: string;
  userId: string;
  type: 'scheduled';
  weekdays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  active: boolean;
  createdAt: string; // ISO date
}

/**
 * Permiso temporal (temporary)
 */
export interface TemporaryPermission {
  id: string;
  userId: string;
  type: 'temporary';
  maxUses: number; // Número máximo de aperturas permitidas
  usesConsumed: number; // Cuántas veces se ha usado
  validForMinutes: number; // Tiempo total de validez desde creación
  expiresAt: string; // ISO date (calculado al crear)
  active: boolean;
  createdAt: string; // ISO date
}

/**
 * Unión de tipos de permiso
 */
export type Permission = ScheduledPermission | TemporaryPermission;

/**
 * Resultado de acceso
 */
export type LogResult = 'granted' | 'denied';

/**
 * Registro de acceso
 */
export interface AccessLog {
  id: string;
  rfidCode: string;
  userId?: string; // Nulo si el RFID no está registrado
  userName?: string; // Nulo si el RFID no está registrado
  result: LogResult;
  deniedReason?: string; // Ej: "Fuera de horario", "Permiso expirado", "RFID no registrado"
  timestamp: string; // ISO date
}

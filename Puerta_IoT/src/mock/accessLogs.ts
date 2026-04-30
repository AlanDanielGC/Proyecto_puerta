import { AccessLog } from '../types';

/**
 * Datos mock de logs de acceso - 20 registros de distintos días
 * Incluye intentos fallidos de RFID desconocido y accesos denegados
 */
export const mockAccessLogs: AccessLog[] = [
  // 1 feb 2026
  {
    id: 'log_001',
    rfidCode: 'RFID001',
    userId: 'user_001',
    userName: 'Daniel Catañeda',
    result: 'granted',
    timestamp: '2026-02-01T09:15:00Z',
  },
  {
    id: 'log_002',
    rfidCode: 'RFID004',
    userId: 'user_004',
    userName: 'Samira Guillen',
    result: 'granted',
    timestamp: '2026-02-01T09:45:00Z',
  },

  // 3 feb 2026
  {
    id: 'log_003',
    rfidCode: 'RFID002',
    userId: 'user_002',
    userName: 'María González',
    result: 'granted',
    timestamp: '2026-02-03T10:30:00Z',
  },
  {
    id: 'log_004',
    rfidCode: 'RFID999',
    result: 'denied',
    deniedReason: 'RFID no registrado',
    timestamp: '2026-02-03T14:20:00Z',
  },
  {
    id: 'log_005',
    rfidCode: 'RFID001',
    userId: 'user_001',
    userName: 'Daniel Catañeda',
    result: 'granted',
    timestamp: '2026-02-03T16:45:00Z',
  },

  // 5 feb 2026
  {
    id: 'log_006',
    rfidCode: 'RFID003',
    userId: 'user_003',
    userName: 'Juan López',
    result: 'denied',
    deniedReason: 'Permiso expirado',
    timestamp: '2026-02-05T08:30:00Z',
  },
  {
    id: 'log_007',
    rfidCode: 'RFID004',
    userId: 'user_004',
    userName: 'Samira Guillen',
    result: 'granted',
    timestamp: '2026-02-05T09:00:00Z',
  },

  // 10 feb 2026
  {
    id: 'log_008',
    rfidCode: 'RFID001',
    userId: 'user_001',
    userName: 'Daniel Catañeda',
    result: 'granted',
    timestamp: '2026-02-10T09:30:00Z',
  },
  {
    id: 'log_009',
    rfidCode: 'RFID002',
    userId: 'user_002',
    userName: 'María González',
    result: 'granted',
    timestamp: '2026-02-10T10:15:00Z',
  },
  {
    id: 'log_010',
    rfidCode: 'RFID888',
    result: 'denied',
    deniedReason: 'RFID no registrado',
    timestamp: '2026-02-10T11:00:00Z',
  },

  // 15 feb 2026
  {
    id: 'log_011',
    rfidCode: 'RFID006',
    userId: 'user_006',
    userName: 'Antonio Orivas',
    result: 'granted',
    timestamp: '2026-02-15T08:45:00Z',
  },
  {
    id: 'log_012',
    rfidCode: 'RFID004',
    userId: 'user_004',
    userName: 'Samira Guillen',
    result: 'granted',
    timestamp: '2026-02-15T15:20:00Z',
  },
  {
    id: 'log_013',
    rfidCode: 'RFID001',
    userId: 'user_001',
    userName: 'Daniel Catañeda',
    result: 'denied',
    deniedReason: 'Fuera de horario',
    timestamp: '2026-02-15T19:00:00Z',
  },

  // 20 feb 2026
  {
    id: 'log_014',
    rfidCode: 'RFID007',
    userId: 'user_007',
    userName: 'Laura Fernández',
    result: 'granted',
    timestamp: '2026-02-20T07:30:00Z',
  },
  {
    id: 'log_015',
    rfidCode: 'RFID003',
    userId: 'user_003',
    userName: 'Juan López',
    result: 'granted',
    timestamp: '2026-02-20T09:00:00Z',
  },

  // 25 feb 2026
  {
    id: 'log_016',
    rfidCode: 'RFID777',
    result: 'denied',
    deniedReason: 'RFID no registrado',
    timestamp: '2026-02-25T12:15:00Z',
  },
  {
    id: 'log_017',
    rfidCode: 'RFID008',
    userId: 'user_008',
    userName: 'Carlos Rodríguez',
    result: 'granted',
    timestamp: '2026-02-25T14:45:00Z',
  },

  // 29 abril 2026 (hoy)
  {
    id: 'log_018',
    rfidCode: 'RFID001',
    userId: 'user_001',
    userName: 'Daniel Catañeda',
    result: 'granted',
    timestamp: '2026-04-29T09:00:00Z',
  },
  {
    id: 'log_019',
    rfidCode: 'RFID002',
    userId: 'user_002',
    userName: 'María González',
    result: 'granted',
    timestamp: '2026-04-29T10:30:00Z',
  },
  {
    id: 'log_020',
    rfidCode: 'RFID666',
    result: 'denied',
    deniedReason: 'RFID no registrado',
    timestamp: '2026-04-29T14:00:00Z',
  },
];

import { Permission } from '../types';

/**
 * Datos mock de permisos - 5 permisos de distintos tipos
 */
export const mockPermissions: Permission[] = [
  {
    id: 'perm_001',
    userId: 'user_001',
    type: 'scheduled',
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '09:00',
    endTime: '17:00',
    active: true,
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'perm_002',
    userId: 'user_002',
    type: 'scheduled',
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '08:00',
    endTime: '16:00',
    active: true,
    createdAt: '2026-02-03T10:30:00Z',
  },
  {
    id: 'perm_003',
    userId: 'user_004',
    type: 'scheduled',
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    startTime: '07:00',
    endTime: '19:00',
    active: true,
    createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 'perm_004',
    userId: 'user_006',
    type: 'temporary',
    maxUses: 4,
    usesConsumed: 2,
    validForMinutes: 1440, // 24 horas
    expiresAt: '2026-04-30T14:00:00Z', // Próximo a expirar
    active: true,
    createdAt: '2026-04-29T14:00:00Z',
  },
  {
    id: 'perm_005',
    userId: 'user_008',
    type: 'temporary',
    maxUses: 1,
    usesConsumed: 0,
    validForMinutes: 120, // 2 horas
    expiresAt: '2026-04-29T18:00:00Z', // Ya expirado
    active: false, // Cambié a false porque ya pasó la fecha
    createdAt: '2026-04-29T16:00:00Z',
  },
];

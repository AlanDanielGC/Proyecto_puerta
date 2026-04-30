import { User } from '../types';
import { mockUsers } from '../mock/users';

/**
 * Servicio de usuarios
 * Actualmente consume datos mock; en producción se reemplazará con llamadas API REST
 */

/**
 * Busca usuarios por nombre, número de control o tipo
 */
export async function searchUsers(query: string, type?: 'student' | 'staff'): Promise<User[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  let results = mockUsers;

  // Filtrar por tipo si se proporciona
  if (type) {
    results = results.filter(user => user.type === type);
  }

  // Filtrar por query en nombre o número de control
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.controlNumber?.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
}

/**
 * Obtiene un usuario por su ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const user = mockUsers.find(u => u.id === userId);
  return user || null;
}

/**
 * Obtiene todos los usuarios
 */
export async function getAllUsers(): Promise<User[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockUsers;
}

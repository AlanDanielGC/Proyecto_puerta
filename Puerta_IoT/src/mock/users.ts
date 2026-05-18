import { User } from '../types';

/**
 * Datos mock de usuarios - 10 usuarios (mezcla de alumnos y personal)
 */
export const mockUsers: User[] = [
  {
    id: 'user_001',
    name: 'Daniel Catañeda',
    controlNumber: '22680135',
    rfidCode: 'RFID001',
    type: 'student',
  },
  {
    id: 'user_002',
    name: 'María González',
    controlNumber: '226812331',
    rfidCode: 'RFID002',
    type: 'student',
  },
  {
    id: 'user_003',
    name: 'Juan López',
    controlNumber: '22680999',
    rfidCode: 'RFID003',
    type: 'student',
  },
  {
    id: 'user_004',
    name: 'Elena Cruz',
    rfidCode: 'RFID004',
    type: 'staff',
    department: 'Docente - Matemáticas',
  },
  {
    id: 'user_005',
    name: 'Roberto Martínez',
    rfidCode: 'RFID005',
    type: 'staff',
    department: 'Director Académico',
  },
  {
    id: 'user_006',
    name: 'Antonio Orivas',
    controlNumber: '22680221',
    rfidCode: 'RFID006',
    type: 'student',
  },
  {
    id: 'user_007',
    name: 'Laura Fernández',
    rfidCode: 'RFID007',
    type: 'staff',
    department: 'Conserje',
  },
  {
    id: 'user_008',
    name: 'Carlos Rodríguez',
    controlNumber: '22683098',
    rfidCode: 'RFID008',
    type: 'student',
  },
  {
    id: 'user_009',
    name: 'Patricia Sánchez',
    rfidCode: 'RFID009',
    type: 'staff',
    department: 'Secretaría',
  },
  {
    id: 'user_010',
    name: 'Andrés Peña',
    controlNumber: '22680423',
    rfidCode: 'RFID010',
    type: 'student',
  },
];

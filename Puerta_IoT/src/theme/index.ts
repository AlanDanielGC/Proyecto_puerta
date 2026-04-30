/**
 * Archivo centralizado de temas y colores
 * Cambiar estos valores para personalizar toda la paleta de la app
 */

export const colors = {
  // Colores principales
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryDark: '#312E81',

  // Colores secundarios
  secondary: '#F97316',
  secondaryLight: '#FDBA74',
  secondaryDark: '#C2410C',

  // Acentos adicionales
  accent: '#06B6D4',
  accentLight: '#67E8F9',

  // Colores de estado
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Colores neutros
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Colores de fondo
  background: '#F4F7FB',
  backgroundAlt: '#EAF0F8',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAFC',
  surfaceTint: '#EEF2FF',
  
  // Colores de texto
  text: '#0F172A',
  textSecondary: '#475569',
  textLight: '#94A3B8',
  
  // Colores específicos por tipo
  studentColor: '#3B82F6', // Azul para alumnos
  staffColor: '#8B5CF6', // Violeta para personal
  
  // Colores para acceso
  accessGranted: '#10B981', // Verde
  accessDenied: '#EF4444', // Rojo
  
  // Bordes
  border: '#D9E2EC',
  borderLight: '#EAF0F8',
  tabBar: '#FFFFFF',
};

/**
 * Tamaños de fuente
 */
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

/**
 * Espaciado
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
};

/**
 * Radio de bordes
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

/**
 * Sombras
 */
export const shadows = {
  none: {},
  sm: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  base: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  xl: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
};

/**
 * Transiciones y duraciones
 */
export const transitions = {
  fast: 150,
  base: 300,
  slow: 500,
};

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Transitions = typeof transitions;

/**
 * Objeto de tema completo
 */
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
};

export default theme;

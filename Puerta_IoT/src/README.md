# Estructura del Proyecto - App Control de Acceso RFID

## 📁 Estructura de Carpetas

```
src/
├── components/              # Componentes reutilizables
│   └── permission/         # Formularios para crear permisos
│       ├── ScheduledPermissionForm.tsx
│       ├── TemporaryPermissionForm.tsx
│       └── index.ts
├── context/                 # Context API (para uso futuro)
├── hooks/                   # Custom hooks (para uso futuro)
├── mock/                    # Datos mock para desarrollo
│   ├── users.ts            # 10 usuarios (alumnos + personal)
│   ├── permissions.ts      # 5 permisos de distintos tipos
│   └── accessLogs.ts       # 20 registros de acceso
├── navigation/              # Configuración de navegación
│   ├── RootNavigator.tsx   # Stack + Tab navigator
│   └── index.ts
├── screens/                 # Pantallas de la app
│   ├── DashboardScreen.tsx          # Inicio (resumen)
│   ├── UserSearchScreen.tsx         # Búsqueda de usuarios
│   ├── UserProfileScreen.tsx        # Perfil del usuario
│   ├── CreatePermissionScreen.tsx   # Creación de permisos (2 pasos)
│   ├── AccessLogsScreen.tsx         # Historial global de accesos
│   └── index.ts
├── services/                # Servicios que consumen datos
│   ├── userService.ts      # searchUsers(), getUserById()
│   ├── permissionService.ts # Gestión de permisos
│   ├── logService.ts       # Gestión de logs de acceso
├── theme/                   # Tema y colores
│   └── index.ts            # Colores, tipografía, espaciado, etc.
└── types/                   # Tipos TypeScript
    └── index.ts            # User, Permission, AccessLog
```

## 🎨 Tema y Colores

El archivo `src/theme/index.ts` centraliza toda la paleta de colores y estilos:

```ts
import { colors, spacing, typography, borderRadius, shadows } from '@/src/theme';

// Cambiar colores es tan simple como editar el archivo
colors.primary = '#7C3AED'  // Morado
colors.error = '#EF4444'    // Rojo
```

## 📱 Pantallas

### 1. Dashboard (Inicio)
- Total de permisos activos
- Últimos 5 accesos registrados
- Intentos fallidos del día
- Botón para crear nuevo permiso

### 2. Búsqueda de Usuarios
- Barra de búsqueda en tiempo real
- Filtros: Todos / Alumnos / Personal
- Búsqueda por nombre o número de control
- Navega a Perfil de Usuario

### 3. Perfil de Usuario
- Información del usuario (nombre, tipo, RFID)
- Sección: Permisos Activos (crear, eliminar)
- Sección: Historial de Accesos (agrupado por día)

### 4. Crear Permiso (2 pasos)
**Paso 1:** Seleccionar tipo (Horario o Temporal)

**Paso 2a - Permiso con Horario:**
- Selector de días de la semana
- Selector de hora de inicio/fin
- Validaciones: hora fin > inicio, al menos un día

**Paso 2b - Permiso Temporal:**
- Número máximo de usos
- Validez en minutos
- Preview de expiración

### 5. Registros Globales de Acceso
- Lista de todos los accesos/intentos
- Agrupados por día
- Filtros: Por resultado (todos/concedidos/denegados)
- Indicadores visuales por color

## 🔧 Servicios

Cada servicio expone funciones `async` que actualmente consumen datos mock:

### userService.ts
- `searchUsers(query, type?)` - Búsqueda de usuarios
- `getUserById(userId)` - Obtener un usuario
- `getAllUsers()` - Obtener todos los usuarios

### permissionService.ts
- `getPermissionsByUser(userId)` - Permisos de un usuario
- `getActivePermissions()` - Todos los permisos activos
- `createScheduledPermission(userId, weekdays, startTime, endTime)`
- `createTemporaryPermission(userId, maxUses, validForMinutes)`
- `deletePermission(permissionId)` - Soft delete (inactiva el permiso)

### logService.ts
- `getAllLogs()` - Todos los logs
- `getLogsByResult(result)` - Filtrar por resultado (granted/denied)
- `getLogsByUser(userId)` - Logs de un usuario
- `getLogsGroupedByDay()` - Logs agrupados por día
- `countTodayFailedAttempts()` - Intentos fallidos hoy
- `createAccessLog(rfidCode, result, deniedReason)` - Agregar nuevo log

## 🚀 Cómo Usar

### Importar componentes:
```tsx
import { DashboardScreen } from '@/src/screens';
import { colors } from '@/src/theme';
import { searchUsers } from '@/src/services/userService';
```

### Usar servicios:
```tsx
const users = await searchUsers('Daniel');
const permissions = await getActivePermissions();
```

### Usar temas:
```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
});
```

## 📊 Datos Mock

### Usuarios (10 total)
- 7 alumnos con número de control
- 3 personal con departamento
- Todos con RFID único (RFID001-RFID010)

### Permisos (5 total)
- 3 permisos con horario (scheduled)
- 2 permisos temporales (temporary)
- Algunos activos, algunos inactivos

### Logs de Acceso (20 total)
- Fechas variadas desde 1 feb 2026
- Mezcla de accesos concedidos y denegados
- Intentos con RFID no registrado
- Agrupados por día

## 🔄 Migración a API Real

Para conectar a la API real del cliente:

1. En `src/services/userService.ts`, reemplazar llamadas a `mockUsers` con `fetch`
2. En `src/services/permissionService.ts`, reemplazar datos mock con API REST
3. En `src/services/logService.ts`, conectar a endpoint de logs

Los componentes **NO necesitarán cambios** porque usan las funciones del servicio.

## ✅ Checklist de Funcionalidades

- [x] Estructura de carpetas según especificación
- [x] Tipos TypeScript completos
- [x] Datos mock (10 usuarios, 5 permisos, 20 logs)
- [x] Servicios async para consumir datos
- [x] Dashboard con estadísticas
- [x] Búsqueda de usuarios con filtros
- [x] Perfil de usuario con permisos e historial
- [x] Creación de permiso en 2 pasos
- [x] Registros de acceso global
- [x] Tema centralizado (colores, espaciado, tipografía)
- [x] Navegación Stack + BottomTabs
- [x] Sin dependencias adicionales (solo las necesarias)
- [x] Compatible con Android 8.0+
- [x] Validaciones en formularios
- [x] Manejo de errores con Alerts

## 📝 Notas Importantes

- **Sin autenticación:** La app asume que el usuario es administrador
- **Sin persistencia local:** AsyncStorage se agregará cuando se implemente login
- **Datos en memoria:** Los cambios se pierden al cerrar la app (esto es temporal para mocks)
- **Soft delete:** Permisos eliminados se marcan como inactivos
- **Mock realista:** Los datos tienen fechas coherentes y patrones realistas

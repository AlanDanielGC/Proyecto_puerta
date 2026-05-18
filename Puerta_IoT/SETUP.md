# 🚪 App Android de Control de Acceso RFID

Aplicación móvil React Native para administración de acceso físico mediante credenciales RFID en una institución educativa.

## 📋 Requisitos

- Node.js 16+ (recomendado 18+)
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Dispositivo Android o emulador

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias

```bash
cd Puerta_IoT
npm install
```

### 2. Ejecutar la app

```bash
# En Android (emulador o dispositivo físico)
npm run android

# O con Expo
expo start --android
```

### 3. Escanear código QR (alternativa)

```bash
expo start
# Escanea con la app Expo Go en tu dispositivo
```

## 📱 Navegación de la App

La app tiene **3 pestañas principales** en la barra inferior:

1. **🏠 Inicio (Dashboard)**
   - Resumen de permisos activos
   - Últimos 5 accesos registrados
   - Intentos fallidos del día
   - Acceso rápido para crear permiso

2. **👥 Usuarios**
   - Búsqueda de usuarios por nombre o Nº control
   - Filtrar por tipo (Todos / Alumnos / Personal)
   - Ver perfil y permisos de cada usuario
   - Crear, editar o eliminar permisos
   - Historial de accesos del usuario

3. **📋 Registros**
   - Todos los accesos/intentos del sistema
   - Agrupados por día
   - Filtros por resultado (concedidos/denegados)
   - Razones de denegación

## 🎨 Personalizar Colores

Todos los colores de la app están centralizados en un único archivo:

**Archivo:** `src/theme/index.ts`

```ts
export const colors = {
  primary: '#7C3AED',      // Color morado principal
  error: '#EF4444',        // Color rojo para errores
  success: '#10B981',      // Color verde para éxito
  // ... más colores
};
```

Cambiar cualquier color aquí actualiza toda la app automáticamente.

## 📊 Datos Mock

En desarrollo, la app usa datos simulados ubicados en `src/mock/`:

- **10 usuarios:** Alumnos (con número de control) y Personal (con departamento)
- **5 permisos:** Mezcla de horarios y temporales, algunos activos y otros no
- **20 registros:** Accesos concedidos y denegados de distintos días

Para cambiar los datos iniciales, edita los archivos en `src/mock/`.

## 🔧 Estructura del Proyecto

```
Puerta_IoT/
├── app/                    # Expo Router setup
│   └── _layout.tsx        # Punto de entrada (usa RootNavigator)
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── mock/             # Datos mock
│   ├── services/         # Servicios para consumir datos
│   ├── screens/          # Pantallas de la app
│   ├── navigation/       # Configuración de navegación
│   ├── theme/            # Colores y estilos
│   └── types/            # Tipos TypeScript
├── assets/               # Imágenes y recursos
├── constants/            # Constantes globales
├── package.json
└── tsconfig.json
```

## 🔄 Conexión a API Real

Actualmente la app usa datos mock. Para conectar a la API real del servidor:

1. Instalar Axios (opcional, ya se puede usar fetch):
   ```bash
   npm install axios
   ```

2. Editar `src/services/*Service.ts` para reemplazar las llamadas mock con llamadas API

**Importante:** Los componentes no necesitarán cambios porque usan las funciones del servicio.

## 📝 Tipos de Datos

### Usuario
```ts
interface User {
  id: string;
  name: string;
  controlNumber?: string;     // Solo alumnos
  rfidCode: string;
  type: 'student' | 'staff';
  department?: string;         // Solo personal
}
```

### Permiso con Horario
```ts
interface ScheduledPermission {
  id: string;
  userId: string;
  type: 'scheduled';
  weekdays: ('mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun')[];
  startTime: string;          // HH:mm
  endTime: string;            // HH:mm
  active: boolean;
  createdAt: string;          // ISO date
}
```

### Permiso Temporal
```ts
interface TemporaryPermission {
  id: string;
  userId: string;
  type: 'temporary';
  maxUses: number;            // Máximo de aperturas
  usesConsumed: number;       // Usos actuales
  validForMinutes: number;    // Validez total
  expiresAt: string;          // ISO date
  active: boolean;
  createdAt: string;          // ISO date
}
```

### Log de Acceso
```ts
interface AccessLog {
  id: string;
  rfidCode: string;
  userId?: string;            // Nulo si RFID no registrado
  userName?: string;
  result: 'granted' | 'denied';
  deniedReason?: string;      // Ej: "Fuera de horario"
  timestamp: string;          // ISO date
}
```

## ⚙️ Funcionalidades Principales

✅ **Búsqueda avanzada** - Por nombre o número de control con filtros
✅ **Gestión de permisos** - Crear, editar (soft delete) en 2 sencillos pasos
✅ **Permisos flexible** - Horarios recurrentes o permisos temporales limitados
✅ **Historial de accesos** - Registro completo agrupado por día
✅ **Dashboard intuitivo** - Resumen rápido del estado del sistema
✅ **Tema personalizable** - Todos los colores en un archivo central
✅ **Sin dependencias extra** - Solo React Native y las librerías esenciales

## 🛠️ Desarrollo

### Agregar nueva pantalla

1. Crear componente en `src/screens/MyScreen.tsx`
2. Agregar ruta en `src/navigation/RootNavigator.tsx`
3. Exportar en `src/screens/index.ts`

### Agregar nuevo servicio

1. Crear `src/services/myService.ts` con funciones async
2. Consumir datos mock de `src/mock/`
3. Importar en componentes

### Cambiar colores/estilos

Solo edita `src/theme/index.ts` - se aplica a toda la app.

## 📞 Soporte

Para problemas comunes:

- **Emulador no arranca:** Asegurate de tener Android SDK instalado
- **Módulos no encontrados:** Ejecuta `npm install` nuevamente
- **Puertos ocupados:** Cambia el puerto: `expo start -p 8081`

## 📄 Licencia

Proyecto para institución educativa.

---

**Versión:** 1.0.0  
**Última actualización:** Abril 2026  
**Stack:** React Native • Expo • TypeScript • React Navigation

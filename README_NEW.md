# 🚪 App Android de Control de Acceso RFID

Aplicación móvil React Native para administración de acceso físico mediante credenciales RFID en una institución educativa.

## 📋 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en Android
npm run android

# O con Expo (escanea el QR con Expo Go)
expo start
```

Para instrucciones detalladas, ver [SETUP.md](SETUP.md)

## 📱 Características

✅ Búsqueda y gestión de usuarios  
✅ Permisos con horario (scheduled)  
✅ Permisos temporales (limited access)  
✅ Historial de accesos agrupado por día  
✅ Dashboard con estadísticas  
✅ Tema personalizable (colores centralizados)  
✅ Datos mock listos para desarrollo  
✅ Estructura preparada para API real  

## 🎨 Personalizar Colores

Todos los colores están en **`src/theme/index.ts`**. Cámbialos y la app se actualiza automáticamente.

## 📖 Documentación

- [SETUP.md](SETUP.md) - Guía completa de instalación y uso
- [src/README.md](src/README.md) - Estructura técnica del proyecto

## 🏗️ Estructura del Proyecto

```
src/
├── screens/           # Todas las pantallas de la app
├── services/          # Lógica de datos (mock -> API real)
├── components/        # Componentes reutilizables
├── navigation/        # Configuración de rutas
├── theme/             # Colores y estilos centralizados
├── types/             # Tipos TypeScript
└── mock/              # Datos de ejemplo
```

## 🔧 Stack Tecnológico

- **Framework:** React Native + Expo
- **Navegación:** React Navigation (Stack + Bottom Tabs)
- **Estado:** Context API (incluida)
- **HTTP:** fetch nativo
- **TypeScript:** Para type safety completo

## ✅ Implementado

- ✅ Estructura de carpetas completa según especificación
- ✅ Tipos TypeScript para User, Permission, AccessLog
- ✅ Datos mock (10 usuarios, 5 permisos, 20 logs)
- ✅ 5 pantallas funcionales con navegación
- ✅ Búsqueda avanzada de usuarios
- ✅ Gestión de permisos (crear, eliminar)
- ✅ Historial de accesos por usuario
- ✅ Dashboard con estadísticas
- ✅ Formulario de permisos en 2 pasos
- ✅ Tema personalizable centralizado
- ✅ Servicios preparados para API real
- ✅ Sin dependencias innecesarias

## 🔄 Próximos Pasos

1. **Conectar API Real:** Reemplaza las funciones en `src/services/` con llamadas al servidor
2. **Agregar Autenticación:** Implementa login + AsyncStorage
3. **Notificaciones en Tiempo Real:** WebSockets o push notifications
4. **Internacionalización:** i18n para múltiples idiomas

## 📞 Contacto

Proyecto desarrollado para institución educativa. Abril 2026.

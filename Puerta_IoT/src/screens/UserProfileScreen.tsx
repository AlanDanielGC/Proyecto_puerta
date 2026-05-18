import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { getUserById } from '../services/userService';
import { getPermissionsByUser, deletePermission } from '../services/permissionService';
import { getUserLogsGroupedByDay } from '../services/logService';
import { User, Permission, AccessLog } from '../types';

export function UserProfileScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [logsByDay, setLogsByDay] = useState<Map<string, AccessLog[]>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [userData, permsData, logsData] = await Promise.all([
        getUserById(userId),
        getPermissionsByUser(userId),
        getUserLogsGroupedByDay(userId),
      ]);
      setUser(userData);
      setPermissions(permsData);
      setLogsByDay(logsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDeletePermission = (permissionId: string) => {
    Alert.alert(
      'Eliminar permiso',
      '¿Estás seguro de que deseas eliminar este permiso?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const success = await deletePermission(permissionId);
              if (success) {
                Alert.alert('Éxito', 'Permiso eliminado');
                await loadData();
              } else {
                Alert.alert('Error', 'No se pudo eliminar el permiso');
              }
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al eliminar el permiso');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Usuario no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={[styles.avatar, { backgroundColor: user.type === 'student' ? colors.info : colors.primary }]}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userType}>{user.type === 'student' ? 'Alumno' : 'Personal'}</Text>
        <View style={styles.userDetailsContainer}>
          {user.controlNumber && <Text style={styles.userDetail}>Nº Control: {user.controlNumber}</Text>}
          {user.department && <Text style={styles.userDetail}>{user.department}</Text>}
          <Text style={styles.userDetail}>RFID: {user.rfidCode}</Text>
        </View>
      </View>

      {/* Permisos Activos Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Permisos Activos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('CreatePermission', { userId })
            }
          >
            <Text style={styles.addButtonText}>+ Crear</Text>
          </TouchableOpacity>
        </View>

        {permissions.filter(p => p.active).length === 0 ? (
          <Text style={styles.emptyText}>No hay permisos activos</Text>
        ) : (
          permissions
            .filter(p => p.active)
            .map(permission => (
              <View key={permission.id} style={styles.permissionCard}>
                <View style={styles.permissionHeader}>
                  <View style={styles.permissionType}>
                    <Text style={styles.permissionTypeText}>
                      {permission.type === 'scheduled'
                        ? '📅 Horario'
                        : '⏱️ Temporal'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePermission(permission.id)}
                  >
                    <Text style={styles.deleteButton}>×</Text>
                  </TouchableOpacity>
                </View>

                {permission.type === 'scheduled' ? (
                  <View style={styles.permissionContent}>
                    <Text style={styles.permissionLabel}>Días</Text>
                    <Text style={styles.permissionDetail}>
                      {permission.weekdays
                        .map(d =>
                          ({
                            mon: 'L',
                            tue: 'M',
                            wed: 'X',
                            thu: 'J',
                            fri: 'V',
                            sat: 'S',
                            sun: 'D',
                          }[d])
                        )
                        .join(', ')}
                    </Text>
                    <Text style={styles.permissionDetail}>
                      {permission.startTime} - {permission.endTime}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.permissionContent}>
                    <Text style={styles.permissionLabel}>Límite temporal</Text>
                    <Text style={styles.permissionDetail}>
                      Usos: {permission.usesConsumed}/{permission.maxUses}
                    </Text>
                    <Text style={styles.permissionDetail}>
                      Expira:{' '}
                      {new Date(permission.expiresAt).toLocaleDateString(
                        'es-ES'
                      )}{' '}
                      {new Date(permission.expiresAt).toLocaleTimeString(
                        'es-ES'
                      )}
                    </Text>
                    {new Date(permission.expiresAt).getTime() <
                      Date.now() + 60 * 60 * 1000 && (
                      <Text style={styles.warningText}>⚠️ Próximo a expirar</Text>
                    )}
                  </View>
                )}
              </View>
            ))
        )}
      </View>

      {/* Access History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Accesos</Text>

        {logsByDay.size === 0 ? (
          <Text style={styles.emptyText}>No hay registros de acceso</Text>
        ) : (
          Array.from(logsByDay.entries())
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([day, logs]) => (
              <View key={day}>
                <Text style={styles.dayHeader}>
                  {new Date(day + 'T00:00:00Z').toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                {logs.map(log => (
                  <View key={log.id} style={styles.logEntry}>
                    <View
                      style={[
                        styles.logStatusIndicator,
                        {
                          backgroundColor:
                            log.result === 'granted'
                              ? colors.success
                              : colors.error,
                        },
                      ]}
                    />
                    <View style={styles.logContent}>
                      <Text style={styles.logTime}>
                        {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                      </Text>
                      <Text style={styles.logResultLabel}>
                        {log.result === 'granted' ? 'Acceso concedido' : 'Acceso denegado'}
                      </Text>
                      {log.deniedReason && (
                        <Text style={styles.logReason}>{log.deniedReason}</Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.logResultText,
                        {
                          color:
                            log.result === 'granted'
                              ? colors.success
                              : colors.error,
                        },
                      ]}
                    >
                      {log.result === 'granted' ? '✓' : '✗'}
                    </Text>
                  </View>
                ))}
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing[14],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  userHeader: {
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    marginBottom: spacing[3],
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    ...shadows.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  avatarText: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing[1],
  },
  userType: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing[3],
  },
  userDetailsContainer: {
    alignItems: 'center',
  },
  userDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing[1],
  },
  section: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  permissionCard: {
    backgroundColor: colors.surface,
    padding: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  permissionType: {
    backgroundColor: colors.surfaceTint,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.full,
  },
  permissionTypeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primaryDark,
  },
  deleteButton: {
    fontSize: typography.fontSize['2xl'],
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
  },
  permissionContent: {
    gap: spacing[1],
  },
  permissionLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  permissionDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  warningText: {
    fontSize: typography.fontSize.sm,
    color: colors.warning,
    marginTop: spacing[1],
  },
  dayHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    marginTop: spacing[3],
    marginBottom: spacing[2],
    textTransform: 'capitalize',
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    marginBottom: spacing[1],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  logStatusIndicator: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    marginRight: spacing[3],
  },
  logContent: {
    flex: 1,
  },
  logTime: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  logResultLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing[1],
  },
  logReason: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginTop: spacing[1],
  },
  logResultText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginVertical: spacing[4],
  },
});

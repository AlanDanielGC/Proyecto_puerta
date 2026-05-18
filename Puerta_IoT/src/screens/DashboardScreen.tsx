import React, { useEffect, useState } from 'react';
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
import { getActivePermissions } from '../services/permissionService';
import { getRecentLogs, countTodayFailedAttempts } from '../services/logService';
import { Permission, AccessLog } from '../types';

export function DashboardScreen({ navigation }: any) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [recentLogs, setRecentLogs] = useState<AccessLog[]>([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [perms, logs, failed] = await Promise.all([
        getActivePermissions(),
        getRecentLogs(5),
        countTodayFailedAttempts(),
      ]);
      setPermissions(perms);
      setRecentLogs(logs);
      setFailedAttempts(failed);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroEyebrow}>Administrador</Text>
            <Text style={styles.heroTitle}>Control de Acceso RFID</Text>
            <Text style={styles.heroSubtitle}>Resumen rápido del sistema y actividad reciente</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeLabel}>Hoy</Text>
          </View>
        </View>
        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatPill}>
            <Text style={styles.heroStatValue}>{permissions.length}</Text>
            <Text style={styles.heroStatLabel}>Activos</Text>
          </View>
          <View style={[styles.heroStatPill, styles.heroStatPillWarning]}>
            <Text style={styles.heroStatValue}>{failedAttempts}</Text>
            <Text style={styles.heroStatLabel}>Fallidos</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {/* Permisos Activos */}
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{permissions.length}</Text>
          <Text style={styles.statLabel}>Permisos Activos</Text>
        </View>

        {/* Intentos Fallidos */}
        <View style={[styles.statCard, styles.statCardError]}>
          <Text style={styles.statValue}>{failedAttempts}</Text>
          <Text style={styles.statLabel}>Intentos Fallidos Hoy</Text>
        </View>
      </View>

      {/* Quick Action Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('UserSearch')}
      >
        <Text style={styles.createButtonText}>+ Crear Nuevo Permiso</Text>
      </TouchableOpacity>

      {/* Recent Logs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Accesos</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>5 recientes</Text>
          </View>
        </View>

        {recentLogs.length === 0 ? (
          <Text style={styles.emptyText}>No hay registros de acceso</Text>
        ) : (
          recentLogs.map(log => (
            <View key={log.id} style={styles.logEntry}>
              <View
                style={[
                  styles.logIndicator,
                  {
                    backgroundColor:
                      log.result === 'granted'
                        ? colors.success
                        : colors.error,
                  },
                ]}
              />
              <View style={styles.logContent}>
                <Text style={styles.logUser}>
                  {log.userName || `RFID: ${log.rfidCode}`}
                </Text>
                <Text style={styles.logTime}>
                  {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                </Text>
              </View>
              <Text
                style={[
                  styles.logResult,
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
  heroCard: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    padding: spacing[5],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  heroEyebrow: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    lineHeight: 36,
    marginTop: spacing[1],
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: 'rgba(255,255,255,0.82)',
    marginTop: spacing[2],
    maxWidth: 260,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  heroBadgeLabel: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  heroStatPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  heroStatPillWarning: {
    backgroundColor: 'rgba(255,255,255,0.11)',
  },
  heroStatValue: {
    color: colors.white,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing[4],
    borderRadius: borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  statCardError: {
    backgroundColor: colors.errorLight,
  },
  statValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...shadows.md,
  },
  createButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  section: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  sectionBadge: {
    backgroundColor: colors.surfaceTint,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  sectionBadgeText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginVertical: spacing[4],
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
  },
  logIndicator: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    marginRight: spacing[3],
  },
  logContent: {
    flex: 1,
  },
  logUser: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing[1],
  },
  logTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  logResult: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});

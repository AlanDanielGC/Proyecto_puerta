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
import { getLogsGroupedByDay } from '../services/logService';
import { AccessLog } from '../types';

export function AccessLogsScreen({ navigation }: any) {
  const [logsByDay, setLogsByDay] = useState<Map<string, AccessLog[]>>(
    new Map()
  );
  const [filteredLogs, setFilteredLogs] = useState<Map<string, AccessLog[]>>(
    new Map()
  );
  const [resultFilter, setResultFilter] = useState<'all' | 'granted' | 'denied'>(
    'all'
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const applyFilters = useCallback(
    (logs: Map<string, AccessLog[]>) => {
      const filtered = new Map<string, AccessLog[]>();

      logs.forEach((dayLogs, day) => {
        const filteredDay = dayLogs.filter(log => {
          if (resultFilter !== 'all' && log.result !== resultFilter) {
            return false;
          }

          return true;
        });

        if (filteredDay.length > 0) {
          filtered.set(day, filteredDay);
        }
      });

      setFilteredLogs(filtered);
    },
    [resultFilter]
  );

  const loadData = useCallback(async () => {
    try {
      const logs = await getLogsGroupedByDay();
      setLogsByDay(logs);
      applyFilters(logs);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros de acceso');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [applyFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    applyFilters(logsByDay);
  }, [applyFilters, logsByDay]);

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
    <View style={styles.container}>
      <View style={styles.heroBox}>
        <Text style={styles.heroKicker}>Actividad</Text>
        <Text style={styles.heroTitle}>Registros de acceso</Text>
        <Text style={styles.heroSubtitle}>Consulta accesos concedidos y denegados con filtros rápidos.</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Resultado:</Text>
        <View style={styles.filterButtonsRow}>
          {['all', 'granted', 'denied'].map(result => (
            <TouchableOpacity
              key={result}
              style={[
                styles.filterButton,
                resultFilter === result && styles.filterButtonActive,
              ]}
              onPress={() => setResultFilter(result as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  resultFilter === result && styles.filterButtonTextActive,
                ]}
              >
                {result === 'all'
                  ? 'Todos'
                  : result === 'granted'
                    ? '✓ Concedidos'
                    : '✗ Denegados'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logs */}
      <ScrollView
        style={styles.logsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredLogs.size === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No hay registros que coincidan</Text>
          </View>
        ) : (
          Array.from(filteredLogs.entries())
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
                  <View key={log.id} style={styles.logCard}>
                    <View
                      style={[
                        styles.logChip,
                        {
                          backgroundColor:
                            log.result === 'granted'
                              ? colors.success
                              : colors.error,
                        },
                      ]}
                    >
                      <Text style={styles.logChipText}>
                        {log.result === 'granted' ? '✓' : '✗'}
                      </Text>
                    </View>
                    <View style={styles.logInfo}>
                      <Text style={styles.logUser}>
                        {log.userName || `RFID: ${log.rfidCode}`}
                      </Text>
                      <Text style={styles.logTime}>
                        {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                      </Text>
                      {log.deniedReason && (
                        <Text style={styles.logReason}>
                          Razón: {log.deniedReason}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBox: {
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    marginBottom: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  heroKicker: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing[1],
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing[2],
  },
  filterButtonsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  logsContainer: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  dayHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    marginTop: spacing[4],
    marginBottom: spacing[2],
    textTransform: 'capitalize',
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  logChip: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  logChipText: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  logInfo: {
    flex: 1,
  },
  logUser: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing[1],
  },
  logTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing[1],
  },
  logReason: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textLight,
    textAlign: 'center',
  },
});

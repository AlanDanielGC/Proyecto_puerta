import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';
import { createScheduledPermission, createTemporaryPermission } from '../services/permissionService';
import { ScheduledPermissionForm, TemporaryPermissionForm } from '../components/permission';

export function CreatePermissionScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const [permissionType, setPermissionType] = useState<'scheduled' | 'temporary' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateScheduled = async (
    weekdays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[],
    startTime: string,
    endTime: string
  ) => {
    setLoading(true);
    try {
      await createScheduledPermission(userId, weekdays, startTime, endTime);
      Alert.alert('Éxito', 'Permiso con horario creado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el permiso');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemporary = async (
    maxUses: number,
    validForMinutes: number
  ) => {
    setLoading(true);
    try {
      await createTemporaryPermission(userId, maxUses, validForMinutes);
      Alert.alert('Éxito', 'Permiso temporal creado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el permiso');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Step 1: Type Selection */}
      {permissionType === null ? (
        <View style={styles.section}>
          <View style={styles.heroBox}>
            <Text style={styles.kicker}>Nuevo permiso</Text>
            <Text style={styles.title}>Selecciona el tipo de permiso</Text>
            <Text style={styles.subtitle}>Elige un acceso recurrente o un pase temporal para esta persona.</Text>
          </View>

          <TouchableOpacity
            style={[styles.typeCard, styles.scheduledCard]}
            onPress={() => setPermissionType('scheduled')}
          >
            <View style={styles.typeIconWrap}>
              <Text style={styles.typeCardEmoji}>📅</Text>
            </View>
            <View style={styles.typeCardBody}>
              <Text style={styles.typeCardTitle}>Permiso con Horario</Text>
              <Text style={styles.typeCardDescription}>
                Acceso recurrente en días y horarios específicos
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeCard, styles.temporaryCard]}
            onPress={() => setPermissionType('temporary')}
          >
            <View style={styles.typeIconWrapAlt}>
              <Text style={styles.typeCardEmoji}>⏱️</Text>
            </View>
            <View style={styles.typeCardBody}>
              <Text style={styles.typeCardTitle}>Permiso Temporal</Text>
              <Text style={styles.typeCardDescription}>
                Acceso limitado por número de usos o tiempo
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Step 2: Form */}
          {permissionType === 'scheduled' ? (
            <ScheduledPermissionForm
              onSubmit={handleCreateScheduled}
              isLoading={loading}
            />
          ) : (
            <TemporaryPermissionForm
              onSubmit={handleCreateTemporary}
              isLoading={loading}
            />
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setPermissionType(null)}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing[12],
  },
  section: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  heroBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing[4],
    marginBottom: spacing[5],
    ...shadows.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  typeCard: {
    backgroundColor: colors.surface,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderRadius: borderRadius['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  scheduledCard: {
    borderLeftWidth: 6,
    borderLeftColor: colors.info,
  },
  temporaryCard: {
    borderLeftWidth: 6,
    borderLeftColor: colors.secondary,
  },
  typeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  typeIconWrapAlt: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  typeCardBody: {
    flex: 1,
  },
  typeCardEmoji: {
    fontSize: 28,
  },
  typeCardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing[1],
  },
  typeCardDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  chevron: {
    fontSize: 28,
    color: colors.textLight,
    marginLeft: spacing[2],
  },
  backButton: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[4],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backButtonText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

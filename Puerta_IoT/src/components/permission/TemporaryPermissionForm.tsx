import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

interface TemporaryPermissionFormProps {
  onSubmit: (maxUses: number, validForMinutes: number) => Promise<void>;
  isLoading: boolean;
}

const createDurationDate = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTime = (date: Date) => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

export function TemporaryPermissionForm({
  onSubmit,
  isLoading,
}: TemporaryPermissionFormProps) {
  const [maxUses, setMaxUses] = useState('1');
  const [validityTime, setValidityTime] = useState(createDurationDate(1, 0));
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS !== 'android');

  const totalMinutes = useMemo(
    () => validityTime.getHours() * 60 + validityTime.getMinutes(),
    [validityTime]
  );

  const expiresAt = useMemo(() => {
    if (totalMinutes < 1) {
      return null;
    }

    return new Date(Date.now() + totalMinutes * 60000);
  }, [totalMinutes]);

  const onChangeValidity = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (!selectedDate) {
      return;
    }

    setValidityTime(createDurationDate(selectedDate.getHours(), selectedDate.getMinutes()));
  };

  const validateAndSubmit = async () => {
    const uses = parseInt(maxUses, 10);
    const hours = validityTime.getHours();
    const minutes = validityTime.getMinutes();

    if (isNaN(uses) || uses < 1) {
      alert('El numero de usos debe ser mayor a 0');
      return;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      alert('Selecciona una hora valida');
      return;
    }

    if (totalMinutes < 1) {
      alert('La validez debe ser mayor a 0 minutos');
      return;
    }

    await onSubmit(uses, totalMinutes);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Permiso Temporal</Text>
        <Text style={styles.heroSubtitle}>Configura el acceso temporal</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Numero maximo de usos</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              value={maxUses}
              onChangeText={setMaxUses}
            />
          </View>
          <Text style={styles.inputHelp}>
            Cuantas veces podra usar este permiso para abrir la puerta.
          </Text>

          <Text style={styles.label}>Validez del permiso</Text>
          <TouchableOpacity
            style={styles.timeField}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.timeFieldLabel}>Duracion (HH:MM)</Text>
            <Text style={styles.timeFieldValue}>{formatTime(validityTime)}</Text>
            <Text style={styles.timeFieldHint}>
              Usa el selector tipo spinner para ajustar horas y minutos
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                mode="time"
                display="spinner"
                value={validityTime}
                onChange={onChangeValidity}
                is24Hour
              />
            </View>
          )}

          {totalMinutes > 0 && (
            <Text style={styles.timeDisplay}>
              Validez total: {validityTime.getHours()}h {validityTime.getMinutes()}m
            </Text>
          )}

          {expiresAt && (
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>Vista previa</Text>
              <Text style={styles.previewText}>Usos permitidos: {maxUses || '0'}</Text>
              <Text style={styles.previewText}>
                Expirara el {expiresAt.toLocaleDateString('es-ES')} a las{' '}
                {expiresAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={validateAndSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Crear Permiso</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: spacing[8],
    borderBottomRightRadius: spacing[8],
    marginBottom: spacing[6],
  },
  heroTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.primaryLight,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  section: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    borderRadius: borderRadius['2xl'],
    ...shadows.md,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing[3],
    marginTop: spacing[4],
  },
  inputContainer: {
    marginBottom: spacing[2],
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    fontSize: typography.fontSize.base,
    color: colors.text,
    backgroundColor: colors.surfaceTint,
  },
  inputHelp: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginBottom: spacing[4],
    fontStyle: 'italic',
    marginTop: spacing[1],
  },
  timeField: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.surfaceTint,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    ...shadows.base,
  },
  timeFieldLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  timeFieldValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing[1],
  },
  timeFieldHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing[1],
  },
  pickerWrapper: {
    marginTop: spacing[3],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  timeDisplay: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginTop: spacing[3],
  },
  previewBox: {
    backgroundColor: colors.successLight,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    marginBottom: spacing[6],
    marginTop: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  previewTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginBottom: spacing[2],
  },
  previewText: {
    fontSize: typography.fontSize.sm,
    color: colors.success,
    marginBottom: spacing[1],
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[6],
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

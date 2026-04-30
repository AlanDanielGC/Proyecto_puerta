import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

interface Day {
  id: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  label: string;
}

const DAYS: Day[] = [
  { id: 'mon', label: 'Lunes' },
  { id: 'tue', label: 'Martes' },
  { id: 'wed', label: 'Miercoles' },
  { id: 'thu', label: 'Jueves' },
  { id: 'fri', label: 'Viernes' },
  { id: 'sat', label: 'Sabado' },
  { id: 'sun', label: 'Domingo' },
];

interface ScheduledPermissionFormProps {
  onSubmit: (
    weekdays: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[],
    startTime: string,
    endTime: string
  ) => Promise<void>;
  isLoading: boolean;
}

const createTime = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTime = (date: Date) => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const isValidTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export function ScheduledPermissionForm({
  onSubmit,
  isLoading,
}: ScheduledPermissionFormProps) {
  const [selectedDays, setSelectedDays] = useState<
    ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  >(['mon', 'tue', 'wed', 'thu', 'fri']);

  const [startTime, setStartTime] = useState(createTime(9, 0));
  const [endTime, setEndTime] = useState(createTime(17, 0));
  const [showStartPicker, setShowStartPicker] = useState(Platform.OS !== 'android');
  const [showEndPicker, setShowEndPicker] = useState(Platform.OS !== 'android');

  const startTotalMinutes = useMemo(
    () => startTime.getHours() * 60 + startTime.getMinutes(),
    [startTime]
  );
  const endTotalMinutes = useMemo(
    () => endTime.getHours() * 60 + endTime.getMinutes(),
    [endTime]
  );

  const toggleDay = (day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun') => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const onChangeStart = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }

    if (!selectedDate) {
      return;
    }

    setStartTime(createTime(selectedDate.getHours(), selectedDate.getMinutes()));
  };

  const onChangeEnd = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }

    if (!selectedDate) {
      return;
    }

    setEndTime(createTime(selectedDate.getHours(), selectedDate.getMinutes()));
  };

  const validateAndSubmit = async () => {
    if (selectedDays.length === 0) {
      alert('Debes seleccionar al menos un dia');
      return;
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      alert('Selecciona horarios validos');
      return;
    }

    if (endTotalMinutes <= startTotalMinutes) {
      alert('La hora de fin debe ser mayor a la hora de inicio');
      return;
    }

    await onSubmit(selectedDays, formatTime(startTime), formatTime(endTime));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Permiso con Horario</Text>
        <Text style={styles.heroSubtitle}>Define dias y horario de acceso</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Dias de la semana</Text>
          <View style={styles.daysContainer}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.id) && styles.dayButtonActive,
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day.id) && styles.dayButtonTextActive,
                  ]}
                >
                  {day.label.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Horario</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeCard}>
              <Text style={styles.timeCardLabel}>Inicio</Text>
              <TouchableOpacity
                style={styles.timeField}
                onPress={() => setShowStartPicker(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.timeFieldValue}>{formatTime(startTime)}</Text>
              </TouchableOpacity>

              {showStartPicker && (
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    mode="time"
                    display="spinner"
                    value={startTime}
                    onChange={onChangeStart}
                    is24Hour
                  />
                </View>
              )}
            </View>

            <View style={styles.timeCard}>
              <Text style={styles.timeCardLabel}>Fin</Text>
              <TouchableOpacity
                style={styles.timeField}
                onPress={() => setShowEndPicker(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.timeFieldValue}>{formatTime(endTime)}</Text>
              </TouchableOpacity>

              {showEndPicker && (
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    mode="time"
                    display="spinner"
                    value={endTime}
                    onChange={onChangeEnd}
                    is24Hour
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Este permiso permitira acceso los {selectedDays.length} dia(s) seleccionados entre{' '}
              {formatTime(startTime)} y {formatTime(endTime)}.
            </Text>
          </View>

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
    marginBottom: spacing[4],
    marginTop: spacing[4],
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing[8],
    gap: spacing[2],
  },
  dayButton: {
    width: '31.5%',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius['2xl'],
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.05 }],
    ...shadows.md,
  },
  dayButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  dayButtonTextActive: {
    color: colors.white,
  },
  timeContainer: {
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  timeCard: {
    backgroundColor: colors.surfaceTint,
    borderRadius: borderRadius['2xl'],
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing[4],
    ...shadows.base,
  },
  timeCardLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  },
  timeField: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  timeFieldValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  pickerWrapper: {
    marginTop: spacing[3],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  infoBox: {
    backgroundColor: colors.infoLight,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius['2xl'],
    marginBottom: spacing[6],
    marginTop: spacing[2],
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.info,
    fontWeight: typography.fontWeight.semibold,
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

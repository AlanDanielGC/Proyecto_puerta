import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { formatAccessLog, getAccessLogsByDate } from '@/lib/database';

const toISODate = (date: Date) => date.toISOString().split('T')[0];

const offsetDate = (dateISO: string, offset: number) => {
  const base = new Date(`${dateISO}T00:00:00`);
  base.setDate(base.getDate() + offset);
  return toISODate(base);
};

export default function HistorialScreen() {
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const records = await getAccessLogsByDate(selectedDate);

        if (isActive) {
          setLogs(records.map(formatAccessLog));
        }
      } catch {
        if (isActive) {
          setLogs([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Historial de Accesos</Text>
        <Text style={styles.subtitle}>Consulta el historial del dia actual o cualquier otra fecha.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Fecha seleccionada</Text>
          <View style={styles.dateRow}>
            <Pressable style={styles.dateButton} onPress={() => setSelectedDate((d) => offsetDate(d, -1))}>
              <Text style={styles.dateButtonText}>-1 dia</Text>
            </Pressable>

            <TextInput
              value={selectedDate}
              onChangeText={setSelectedDate}
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
            />

            <Pressable style={styles.dateButton} onPress={() => setSelectedDate((d) => offsetDate(d, 1))}>
              <Text style={styles.dateButtonText}>+1 dia</Text>
            </Pressable>
          </View>

          <Text style={styles.logTitle}>Accesos del dia</Text>
          {isLoading ? (
            <Text style={styles.emptyText}>Cargando accesos...</Text>
          ) : logs.length === 0 ? (
            <Text style={styles.emptyText}>No hay eventos para la fecha seleccionada.</Text>
          ) : (
            logs.map((log, index) => (
              <View key={`${log}-${index}`} style={styles.logRow}>
                <View style={styles.dot} />
                <Text style={styles.logText}>{log}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FAFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 24,
  },
  title: {
    color: '#0B3F88',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#4A6E95',
    marginTop: 4,
    marginBottom: 18,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderColor: '#D8E8FF',
    borderWidth: 1,
  },
  label: {
    color: '#2E4C72',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateButton: {
    backgroundColor: '#E2EFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  dateButtonText: {
    color: '#0B3F88',
    fontWeight: '700',
    fontSize: 12,
  },
  dateInput: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#F6FAFF',
    borderColor: '#CFE2FF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#12345D',
  },
  logTitle: {
    color: '#0B3F88',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyText: {
    color: '#5D7491',
    fontSize: 14,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D63C8',
    marginRight: 10,
  },
  logText: {
    color: '#1D3657',
    fontSize: 14,
    flex: 1,
  },
});

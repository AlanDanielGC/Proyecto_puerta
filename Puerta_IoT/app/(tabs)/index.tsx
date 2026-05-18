import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { createAccessLog, formatAccessLog, getRecentAccessLogs } from '@/lib/database';

export default function HomeScreen() {
  const [entries, setEntries] = useState<string[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const nowText = useMemo(() => lastRefresh.toLocaleString(), [lastRefresh]);

  useEffect(() => {
    let isActive = true;

    const loadRecentEntries = async () => {
      try {
        const records = await getRecentAccessLogs(8);

        if (isActive) {
          setEntries(records.map(formatAccessLog));
          setLastRefresh(new Date());
        }
      } catch {
        if (isActive) {
          setEntries([]);
        }
      }
    };

    loadRecentEntries();

    return () => {
      isActive = false;
    };
  }, []);

  const handleOpenDoor = async () => {
    try {
      setIsOpening(true);
      await createAccessLog('Acceso manual autorizado desde el celular', null, 'apertura');

      const records = await getRecentAccessLogs(8);
      setEntries(records.map(formatAccessLog));
      setLastRefresh(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar la apertura.';
      Alert.alert('Error', message);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundShape} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Control de Puerta</Text>
        <Text style={styles.subtitle}>Interfaz principal</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Estado del sistema</Text>
          <Text style={styles.statusValue}>Listo para abrir</Text>
          <Text style={styles.statusDate}>Actualizado: {nowText}</Text>
        </View>

        <Pressable
          style={[styles.openButton, isOpening && styles.openButtonDisabled]}
          onPress={handleOpenDoor}
          disabled={isOpening}>
          <Text style={styles.openButtonText}>{isOpening ? '...' : 'Abrir'}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Registro de entradas recientes</Text>
        <View style={styles.logCard}>
          {entries.length === 0 ? (
            <Text style={styles.emptyLogText}>Aun no hay accesos registrados hoy.</Text>
          ) : (
            entries.map((item, index) => (
              <View key={`${item}-${index}`} style={styles.logRow}>
                <View style={styles.logDot} />
                <Text style={styles.logText}>{item}</Text>
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
  backgroundShape: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#D6E9FF',
    opacity: 0.9,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0B3F88',
  },
  subtitle: {
    marginTop: 4,
    color: '#4A6E95',
    fontSize: 15,
    marginBottom: 18,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8E8FF',
    shadowColor: '#2C6FB7',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 24,
  },
  statusLabel: {
    color: '#4A6E95',
    fontSize: 14,
  },
  statusValue: {
    marginTop: 6,
    fontSize: 22,
    color: '#0D63C8',
    fontWeight: '800',
  },
  statusDate: {
    marginTop: 8,
    color: '#5D7491',
  },
  openButton: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: '#0D63C8',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#0D63C8',
    shadowOpacity: 0.36,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 24,
  },
  openButtonDisabled: {
    opacity: 0.7,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  sectionTitle: {
    color: '#0B3F88',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderColor: '#D8E8FF',
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  emptyLogText: {
    color: '#5D7491',
    fontSize: 14,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logDot: {
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

import { useMemo, useState } from 'react';
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

  import { createAccessLog, deleteUser, getUserByRfid, updateUser } from '@/lib/database';

export default function AdministrarScreen() {
  const [rfidSearch, setRfidSearch] = useState('');
  const [numeroControl, setNumeroControl] = useState('');
  const [rfid, setRfid] = useState('');
  const [permiso, setPermiso] = useState<'permanente' | 'temporal'>('permanente');
  const [contadorEntradas, setContadorEntradas] = useState('');
  const [found, setFound] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canSave = useMemo(() => {
    if (!found) return false;
    if (!numeroControl.trim() || !rfid.trim()) return false;
    if (permiso === 'temporal' && !contadorEntradas.trim()) return false;
    return true;
  }, [contadorEntradas, found, numeroControl, permiso, rfid]);

  const handleSearch = async () => {
    if (!rfidSearch.trim()) {
      Alert.alert('Dato faltante', 'Escribe un RFID para buscar.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await getUserByRfid(rfidSearch);

      if (!user) {
        setFound(false);
        setRecordId('');
        Alert.alert('Sin resultados', 'No se encontro un usuario con ese RFID.');
        return;
      }

      setFound(true);
      setRecordId(user.id);
      setNumeroControl(user.numero_control);
      setRfid(user.rfid);
      setPermiso(user.permiso);
      setContadorEntradas(user.contador_entradas?.toString() ?? '');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo consultar el usuario.';
      Alert.alert('Error al buscar', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recordId) {
      Alert.alert('Sin registro', 'Primero busca un usuario válido.');
      return;
    }

    if (!canSave) {
      Alert.alert('Datos incompletos', 'Completa los campos obligatorios antes de guardar.');
      return;
    }

    try {
      setIsLoading(true);
      const updated = await updateUser(recordId, {
        numeroControl,
        rfid,
        permiso,
        contadorEntradas,
      });

      await createAccessLog(`Usuario actualizado: ${updated.rfid}`, updated.rfid, 'actualizacion');

      Alert.alert('Datos guardados', 'Los cambios del usuario fueron actualizados.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el usuario.';
      Alert.alert('Error al guardar', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) {
      Alert.alert('Sin registro', 'Primero busca un usuario válido.');
      return;
    }

    try {
      setIsLoading(true);
      const deleted = await deleteUser(recordId);
      await createAccessLog(`Usuario eliminado: ${deleted.rfid}`, deleted.rfid, 'eliminacion');

      Alert.alert('Usuario eliminado', 'El usuario fue eliminado correctamente.');
      setFound(false);
      setRecordId('');
      setRfidSearch('');
      setNumeroControl('');
      setRfid('');
      setPermiso('permanente');
      setContadorEntradas('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el usuario.';
      Alert.alert('Error al eliminar', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Administrar Usuarios</Text>
        <Text style={styles.subtitle}>Busca por RFID para modificar o eliminar un usuario.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>RFID a buscar</Text>
          <View style={styles.searchRow}>
            <TextInput
              value={rfidSearch}
              onChangeText={setRfidSearch}
              style={[styles.input, styles.searchInput]}
              placeholder="Ej. RFID-AB12CD"
              autoCapitalize="characters"
            />
            <Pressable
              style={[styles.searchButton, isLoading && styles.buttonDisabled]}
              onPress={handleSearch}
              disabled={isLoading}>
              <Text style={styles.searchButtonText}>{isLoading ? '...' : 'Buscar'}</Text>
            </Pressable>
          </View>

          {found && (
            <>
              <Text style={styles.label}>Numero de control</Text>
              <TextInput
                value={numeroControl}
                onChangeText={setNumeroControl}
                style={styles.input}
                keyboardType="numeric"
              />

              <Text style={styles.label}>RFID</Text>
              <TextInput
                value={rfid}
                onChangeText={setRfid}
                style={styles.input}
                autoCapitalize="characters"
              />

              <Text style={styles.label}>Permiso</Text>
              <View style={styles.optionRow}>
                <Pressable style={styles.optionItem} onPress={() => setPermiso('permanente')}>
                  <View style={[styles.checkbox, permiso === 'permanente' && styles.checkboxActive]} />
                  <Text style={styles.optionText}>Permanente</Text>
                </Pressable>

                <Pressable style={styles.optionItem} onPress={() => setPermiso('temporal')}>
                  <View style={[styles.checkbox, permiso === 'temporal' && styles.checkboxActive]} />
                  <Text style={styles.optionText}>Temporal</Text>
                </Pressable>
              </View>

              {permiso === 'temporal' && (
                <>
                  <Text style={styles.label}>Contador de entradas</Text>
                  <TextInput
                    value={contadorEntradas}
                    onChangeText={setContadorEntradas}
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </>
              )}

              <Pressable
                style={[styles.saveButton, (!canSave || isLoading) && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={!canSave || isLoading}>
                <Text style={styles.saveButtonText}>Guardar datos</Text>
              </Pressable>

              <Pressable
                style={[styles.deleteButton, isLoading && styles.buttonDisabled]}
                onPress={handleDelete}
                disabled={isLoading}>
                <Text style={styles.deleteButtonText}>Eliminar usuario</Text>
              </Pressable>
            </>
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#0D63C8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#F6FAFF',
    borderColor: '#CFE2FF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#12345D',
    marginBottom: 12,
  },
  optionRow: {
    marginBottom: 12,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#8FB8EE',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#0D63C8',
    borderColor: '#0D63C8',
  },
  optionText: {
    color: '#1D3657',
    fontSize: 14,
  },
  saveButton: {
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#0D63C8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#EFF5FF',
    borderWidth: 1,
    borderColor: '#A9C7EF',
  },
  deleteButtonText: {
    color: '#1F4D86',
    fontWeight: '800',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});

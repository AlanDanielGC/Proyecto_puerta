import { useRouter } from 'expo-router';
import { useState } from 'react';
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

  import { createAccessLog, createUser } from '@/lib/database';

type UserType = 'permanente' | 'temporal';

export default function RegistroScreen() {
  const router = useRouter();
  const [numeroControl, setNumeroControl] = useState('');
  const [rfid, setRfid] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<UserType>('permanente');
  const [contadorEntradas, setContadorEntradas] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setNumeroControl('');
    setRfid('');
    setTipoUsuario('permanente');
    setContadorEntradas('');
  };

  const handleRegister = async () => {
    if (!numeroControl.trim() || !rfid.trim()) {
      Alert.alert('Campos incompletos', 'Captura Numero de control y RFID.');
      return;
    }

    if (tipoUsuario === 'temporal' && !contadorEntradas.trim()) {
      Alert.alert('Dato faltante', 'Indica el contador de entradas para usuario temporal.');
      return;
    }

    try {
      setIsSaving(true);
      const user = await createUser({
        numeroControl,
        rfid,
        permiso: tipoUsuario,
        contadorEntradas,
      });

      await createAccessLog(`Usuario registrado: ${user.rfid}`, user.rfid, 'registro');

      Alert.alert('Usuario registrado', 'El usuario se registro correctamente.');
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el usuario.';
      Alert.alert('Error al registrar', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.navigate('/(tabs)')} style={styles.backButton}>
          <Text style={styles.backText}>Regresar</Text>
        </Pressable>

        <Text style={styles.title}>Registrar Usuario</Text>
        <Text style={styles.subtitle}>Completa los datos para dar acceso.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Numero de control</Text>
          <TextInput
            value={numeroControl}
            onChangeText={setNumeroControl}
            placeholder="Ej. 20260001"
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.label}>RFID</Text>
          <TextInput
            value={rfid}
            onChangeText={setRfid}
            placeholder="Ej. RFID-AB12CD"
            style={styles.input}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Tipo de usuario</Text>
          <View style={styles.optionRow}>
            <Pressable style={styles.optionItem} onPress={() => setTipoUsuario('permanente')}>
              <View style={[styles.checkbox, tipoUsuario === 'permanente' && styles.checkboxActive]} />
              <Text style={styles.optionText}>Usuario permanente</Text>
            </Pressable>

            <Pressable style={styles.optionItem} onPress={() => setTipoUsuario('temporal')}>
              <View style={[styles.checkbox, tipoUsuario === 'temporal' && styles.checkboxActive]} />
              <Text style={styles.optionText}>Usuario temporal</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Contador de entradas</Text>
          <TextInput
            value={contadorEntradas}
            onChangeText={setContadorEntradas}
            placeholder="Solo para usuario temporal"
            style={[styles.input, tipoUsuario === 'permanente' && styles.inputDisabled]}
            keyboardType="numeric"
            editable={tipoUsuario === 'temporal'}
          />

          <Pressable
            style={[styles.registerButton, isSaving && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isSaving}>
            <Text style={styles.registerButtonText}>{isSaving ? 'Guardando...' : 'Registrar'}</Text>
          </Pressable>
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
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2EFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 12,
  },
  backText: {
    color: '#0B3F88',
    fontWeight: '700',
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
    shadowColor: '#2C6FB7',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 2,
  },
  label: {
    color: '#2E4C72',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '700',
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
  inputDisabled: {
    opacity: 0.45,
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
  registerButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#0D63C8',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});

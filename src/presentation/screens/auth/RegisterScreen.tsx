import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { UserRole } from '../../../domain/entities/User';
import { RegisterUseCase } from '../../../domain/usecases/RegisterUseCase';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const authRepository = new AuthRepositoryImpl();
      const registerUseCase = new RegisterUseCase(authRepository);
      const user = await registerUseCase.execute({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      login(user);
    } catch (e) {
      setError('Error al registrarse. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a CantiApp hoy</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Nombre"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ingresa tu nombre"
            icon="person-outline"
          />
          <Input
            label="Apellido"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ingresa tu apellido"
            icon="person-outline"
          />
          <Input
            label="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="Ingresa tu correo"
            autoCapitalize="none"
            keyboardType="email-address"
            icon="mail-outline"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            icon="lock-closed-outline"
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Estudiante" value="student" />
                <Picker.Item label="Padre/Tutor" value="parent" />
                <Picker.Item label="Cantina" value="cafeteria" />
              </Picker>
            </View>
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonContainer}>
            <Button title="Registrarse" onPress={handleRegister} loading={loading} />
          </View>

          <TouchableOpacity 
            style={styles.linkContainer}
            onPress={() => (navigation as any).navigate('Login')}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes una cuenta? <Text style={styles.linkHighlight}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  linkHighlight: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const RoleOption = ({ value, label, icon }: { value: UserRole; label: string; icon: string }) => {
    const isSelected = role === value;
    return (
      <TouchableOpacity
        style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
        onPress={() => setRole(value)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Ionicons
            name={icon as any}
            size={24}
            color={isSelected ? colors.white : colors.textSecondary}
          />
        </View>
        <Text style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}>{label}</Text>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

          <View style={styles.roleContainer}>
            <Text style={styles.label}>Selecciona tu Rol</Text>
            <View style={styles.rolesGrid}>
              <RoleOption value="student" label="Estudiante" icon="school-outline" />
              <RoleOption value="parent" label="Representante" icon="people-outline" />
              <RoleOption value="cafeteria" label="Cantina" icon="restaurant-outline" />
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
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
  roleContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  rolesGrid: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    height: 72,
  },
  roleOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8F0', // Light orange tint
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
  },
  roleLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  roleLabelSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 8,
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
    paddingBottom: 20,
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

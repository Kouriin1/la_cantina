import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../../domain/usecases/LoginUseCase';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('aplicacio@gmail.com');
  const [password, setPassword] = useState('12345');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const authRepository = new AuthRepositoryImpl();
      const loginUseCase = new LoginUseCase(authRepository);
      const user = await loginUseCase.execute(email, password);
      login(user);
    } catch (e) {
      setError('Error al iniciar sesión. Por favor verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="restaurant" size={40} color={colors.white} />
          </View>
          <Text style={styles.title}>Cantina Escolar</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            icon="person-outline"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            icon="lock-closed-outline"
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonContainer}>
            <Button title="Iniciar sesión" onPress={handleLogin} loading={loading} />
          </View>

          <TouchableOpacity 
            style={styles.linkContainer}
            onPress={() => (navigation as any).navigate('Register')}
          >
            <Text style={styles.linkText}>
              ¿No tienes una cuenta? <Text style={styles.linkHighlight}>Regístrate</Text>
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
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 24,
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

export default LoginScreen;

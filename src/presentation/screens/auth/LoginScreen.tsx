import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuthStore } from '../../state/authStore';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '../../../domain/usecases/LoginUseCase';
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
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CantiApp</Text>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} loading={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.primary,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;

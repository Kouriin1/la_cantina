import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuthStore } from '../../state/authStore';
import { AuthRepositoryImpl } from '../../../data/repositories/AuthRepositoryImpl';
import { RegisterUseCase } from '../../../domain/usecases/RegisterUseCase';
import { UserRole } from '../../../domain/entities/User';
import { Picker } from '@react-native-picker/picker';
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
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Input
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />
      <Input
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />
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
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Role</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Parent" value="parent" />
          <Picker.Item label="Cafeteria" value="cafeteria" />
        </Picker>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Register" onPress={handleRegister} loading={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
  pickerContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default RegisterScreen;

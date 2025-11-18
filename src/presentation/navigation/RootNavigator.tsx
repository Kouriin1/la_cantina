import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../state/authStore';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainNavigator from './MainNavigator';
import { GetCurrentUserUseCase } from '../../domain/usecases/GetCurrentUserUseCase';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';

const Stack = createNativeStackNavigator();

const Root = () => {
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      const authRepository = new AuthRepositoryImpl();
      const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
      const user = await getCurrentUserUseCase.execute();
      setUser(user);
    };
    checkUser();
  }, [setUser]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Root;

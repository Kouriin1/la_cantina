import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { GetCurrentUserUseCase } from '../../domain/usecases/GetCurrentUserUseCase';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import { useAuthStore } from '../state/authStore';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

const Root = () => {
  const { isAuthenticated, setUser } = useAuthStore();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      // Mínimo tiempo de splash screen para que se aprecie la animación
      const minSplashTime = new Promise(resolve => setTimeout(resolve, 5000));

      const checkUser = async () => {
        try {
          const authRepository = new AuthRepositoryImpl();
          const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
          const user = await getCurrentUserUseCase.execute();
          setUser(user);
        } catch (error) {
          console.log('No user session found');
        }
      };

      await Promise.all([minSplashTime, checkUser()]);
      setIsAppReady(true);
    };

    initApp();
  }, [setUser]);

  if (!isAppReady) {
    return <SplashScreen />;
  }

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

import React from 'react';
import { Text, View } from 'react-native';
import { useAuthStore } from '../state/authStore';
import CafeteriaNavigator from './CafeteriaNavigator';
import ParentNavigator from './ParentNavigator';
import StudentNavigator from './StudentNavigator';

const MainNavigator = () => {
  const { user } = useAuthStore();

  if (user?.role === 'student') {
    return <StudentNavigator />;
  }

  if (user?.role === 'parent') {
    return <ParentNavigator />;
  }

  if (user?.role === 'cafeteria') {
    return <CafeteriaNavigator />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rol de usuario desconocido</Text>
    </View>
  );
};

export default MainNavigator;

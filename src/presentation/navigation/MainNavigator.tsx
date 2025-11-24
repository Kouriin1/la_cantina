import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../state/authStore';
import StudentNavigator from './StudentNavigator';
import ParentNavigator from './ParentNavigator';
import CafeteriaNavigator from './CafeteriaNavigator';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { user } = useAuthStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      {user?.role === 'student' && (
        <Tab.Screen name="Student" component={StudentNavigator} />
      )}
      {user?.role === 'parent' && (
        <Tab.Screen name="Parent" component={ParentNavigator} />
      )}
      {user?.role === 'cafeteria' && (
        <Tab.Screen name="Cafeteria" component={CafeteriaNavigator} />
      )}
    </Tab.Navigator>
  );
};

export default MainNavigator;

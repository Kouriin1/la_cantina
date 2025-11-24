import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import ProfileScreen from '../screens/shared/ProfileScreen';
import StudentMenuScreen from '../screens/student/StudentMenuScreen';
import WalletScreen from '../screens/student/WalletScreen';
import { colors } from '../theme/colors';

import CustomHeader from '../components/CustomHeader';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/shared/SettingsScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
};

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Menu') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Menu" component={StudentMenuScreen} options={{ title: 'Menú' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: 'Billetera' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Perfil' }}/>
    </Tab.Navigator>
  );
};

export default StudentNavigator;

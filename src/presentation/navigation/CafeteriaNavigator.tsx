import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AdminPanelScreen from '../screens/cafeteria/AdminPanelScreen';
import ProductsScreen from '../screens/cafeteria/ProductsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
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

const CafeteriaNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Orders" component={AdminPanelScreen} options={{ title: 'Pedidos' }} />
      <Tab.Screen name="Products" component={ProductsScreen} options={{ title: 'Productos' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Cantina' }} />
    </Tab.Navigator>
  );
};

export default CafeteriaNavigator;

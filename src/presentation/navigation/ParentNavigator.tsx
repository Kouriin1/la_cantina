import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ChildOrdersScreen from '../screens/parent/ChildOrdersScreen';
import HistoryScreen from '../screens/parent/HistoryScreen';
import RechargeScreen from '../screens/parent/RechargeScreen';
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

const ParentNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <CustomHeader />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Child Orders') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Recharge') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Child Orders" component={ChildOrdersScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Recharge" component={RechargeScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Profile' }}/>
    </Tab.Navigator>
  );
};

export default ParentNavigator;

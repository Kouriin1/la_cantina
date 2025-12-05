import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../components/CustomHeader';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import CartScreen from '../screens/student/CartScreen';
import FavoritesScreen from '../screens/student/FavoritesScreen';
import OrdersScreen from '../screens/student/OrdersScreen';
import StudentMenuScreen from '../screens/student/StudentMenuScreen';
import WalletScreen from '../screens/student/WalletScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    </ProfileStack.Navigator>
  );
};

const MenuStackNavigator = () => {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuList" component={StudentMenuScreen} />
      <MenuStack.Screen name="Cart" component={CartScreen} />
    </MenuStack.Navigator>
  );
};

const StudentNavigator = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => <CustomHeader />,
          tabBarIcon: ({ focused, color }) => {
            let iconName: any;

            if (route.name === 'MenuStack') {
              iconName = focused ? 'fast-food' : 'fast-food-outline';
            } else if (route.name === 'Orders') {
              iconName = focused ? 'receipt' : 'receipt-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Wallet') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'ProfileStack') {
              iconName = focused ? 'school' : 'school-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#E8E8E8',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            backgroundColor: '#fff',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 4,
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        })}
      >
        <Tab.Screen name="MenuStack" component={MenuStackNavigator} options={{ title: 'Menú' }} />
        <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Pedidos' }} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
        <Tab.Screen name="Wallet" component={WalletScreen} options={{ title: 'Billetera' }} />
        <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default StudentNavigator;

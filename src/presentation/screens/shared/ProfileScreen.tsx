import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';
import { User } from '../../../domain/entities/User';
import { UserRepositoryImpl } from '../../../data/repositories/UserRepositoryImpl';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user } = useAuthStore();
  const [child, setChild] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChildData = async () => {
      if (user?.role === 'parent' && user.childId) {
        const userRepository = new UserRepositoryImpl();
        const childData = await userRepository.getUserById(user.childId);
        setChild(childData);
      }
    };
    fetchChildData();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.firstName} {user?.lastName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>
      {user?.role === 'parent' && child && (
        <>
          <Text style={styles.childTitle}>Child Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{child.firstName} {child.lastName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{child.email}</Text>
          </View>
        </>
      )}
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    fontSize: 16,
  },
  childTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ProfileScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const SettingsScreen = () => {
  const { user } = useAuthStore();

  // Mock creation date
  const createdAt = new Date(new Date().setDate(new Date().getDate() - 10));

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Account Created:</Text>
        <Text style={styles.value}>{createdAt.toLocaleDateString()}</Text>
      </View>
      <Button title="Delete Account" onPress={handleDeleteAccount} />
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
    width: 150,
  },
  value: {
    fontSize: 16,
  },
});

export default SettingsScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../state/authStore';
import { TokenRepositoryImpl } from '../../../data/repositories/TokenRepositoryImpl';

const RechargeScreen = () => {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!user || !user.childId) return;
    setLoading(true);
    try {
      const tokenRepository = new TokenRepositoryImpl();
      await tokenRepository.rechargeTokens(user.childId, parseFloat(amount));
      alert('Recharge successful!');
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Recharge failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recharge Child's Wallet</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Recharge" onPress={handleRecharge} loading={loading} />
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
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default RechargeScreen;

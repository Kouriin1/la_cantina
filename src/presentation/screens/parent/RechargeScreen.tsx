import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { TokenRepositoryImpl } from '../../../data/repositories/TokenRepositoryImpl';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const RechargeScreen = () => {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!user || !user.childId) return;
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    setLoading(true);
    try {
      const tokenRepository = new TokenRepositoryImpl();
      await tokenRepository.rechargeTokens(user.childId, parseFloat(amount));
      Alert.alert('¡Éxito!', `Se han recargado Bs.S ${amount} correctamente.`);
      setAmount('');
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'La recarga falló. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const selectAmount = (value: string) => {
    setAmount(value);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#B8956A', '#A67C52', '#B8956A']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Billetera</Text>
          <Text style={styles.headerSubtitle}>Recarga saldo para tu hijo</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.balanceLabel}>Saldo Actual Estimado</Text>
            </View>
            <Text style={styles.balanceAmount}>Bs.S 1,250.00</Text>
            <Text style={styles.studentName}>Estudiante: {user?.firstName || 'Hijo'}</Text>
          </View>

          <Text style={styles.sectionTitle}>Selecciona un monto</Text>

          <View style={styles.presetsContainer}>
            {['50', '100', '200', '500'].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.presetButton, amount === val && styles.presetButtonActive]}
                onPress={() => selectAmount(val)}
              >
                <Text style={[styles.presetText, amount === val && styles.presetTextActive]}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>O ingresa otro monto</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>Bs.S</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#ccc"
            />
          </View>

          <TouchableOpacity
            style={styles.rechargeButton}
            onPress={handleRecharge}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading ? ['#BDC3C7', '#95A5A6'] : [colors.secondary, '#E67E22']}
              style={styles.rechargeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {loading ? (
                <Text style={styles.rechargeText}>Procesando...</Text>
              ) : (
                <>
                  <Ionicons name="card-outline" size={24} color={colors.white} />
                  <Text style={styles.rechargeText}>Recargar Saldo</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>Pagos seguros y encriptados</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
    marginTop: -50, // Overlap header
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  presetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  presetButton: {
    width: 70,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  presetButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  presetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  presetTextActive: {
    color: colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  rechargeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rechargeGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  rechargeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default RechargeScreen;

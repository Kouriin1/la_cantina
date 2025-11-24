import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TokenRepositoryImpl } from '../../../data/repositories/TokenRepositoryImpl';
import { TokenTransaction } from '../../../domain/entities/TokenTransaction';
import { GetTransactionsByUserUseCase } from '../../../domain/usecases/GetTransactionsByUserUseCase';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const WalletScreen = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const tokenRepository = new TokenRepositoryImpl();
        const getTransactionsUseCase = new GetTransactionsByUserUseCase(tokenRepository);
        const transactionsResult = await getTransactionsUseCase.execute(user.id);
        setTransactions(transactionsResult);

        const balanceResult = await tokenRepository.getTokenBalance(user.id);
        setBalance(balanceResult);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const renderItem = ({ item }: { item: TokenTransaction }) => (
    <View style={styles.transactionContainer}>
      <View style={styles.transactionIcon}>
        <Ionicons 
          name={item.amount > 0 ? "arrow-down" : "arrow-up"} 
          size={20} 
          color={item.amount > 0 ? colors.success : colors.danger} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{item.type === 'recharge' ? 'Recarga' : item.type === 'purchase' ? 'Compra' : item.type}</Text>
        <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.amount > 0 ? styles.amountPositive : styles.amountNegative]}>
        {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)} Bs.S
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={24} color={colors.white} />
          </View>
          <Text style={styles.cardLabel}>Saldo disponible</Text>
          <TouchableOpacity style={styles.rechargeButton}>
            <Ionicons name="flash" size={16} color={colors.primary} />
            <Text style={styles.rechargeText}>Recargar</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.balanceText}>Bs.S {balance.toFixed(2).replace('.', ',')}</Text>
        
        {balance < 10 && (
          <View style={styles.lowBalanceTag}>
            <Text style={styles.lowBalanceText}>Saldo bajo</Text>
          </View>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Nivel de saldo</Text>
            <Text style={styles.progressValue}>{Math.min(Math.max((balance / 100) * 100, 0), 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.min(Math.max((balance / 100) * 100, 0), 100)}%` }]} />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Historial de transacciones</Text>
      
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay transacciones recientes.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardLabel: {
    color: colors.white,
    fontSize: 16,
    flex: 1,
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  rechargeText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  balanceText: {
    color: colors.white,
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lowBalanceTag: {
    backgroundColor: colors.danger,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  lowBalanceText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.8,
  },
  progressValue: {
    color: colors.white,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountPositive: {
    color: colors.success,
  },
  amountNegative: {
    color: colors.danger,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
});

export default WalletScreen;


import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

  const renderItem = ({ item }: { item: TokenTransaction }) => {
    const isPositive = item.amount > 0;
    const transactionTypeText =
      item.type === 'recharge' ? 'Recarga' :
        item.type === 'purchase' ? 'Compra' :
          item.type;

    return (
      <View style={styles.transactionContainer}>
        <LinearGradient
          colors={isPositive ? ['#61C9A8', '#4FB896'] : ['#ED9B40', '#E8872E']}
          style={styles.transactionIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={isPositive ? "arrow-down" : "arrow-up"}
            size={22}
            color="#fff"
          />
        </LinearGradient>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>{transactionTypeText}</Text>
          <View style={styles.transactionDateRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.transactionDate}>
              {new Date(item.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, isPositive ? styles.amountPositive : styles.amountNegative]}>
          {isPositive ? '+' : ''}{item.amount.toFixed(2)} Bs.S
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wallet" size={60} color={colors.primary} />
        <Text style={styles.loadingText}>Cargando billetera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Balance Card con gradiente premium */}
      <LinearGradient
        colors={['#B8956A', '#A67C52', '#B8956A']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={28} color="#fff" />
          </View>
          <Text style={styles.cardLabel}>Saldo Disponible</Text>
          <TouchableOpacity style={styles.rechargeButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#61C9A8', '#4FB896']}
              style={styles.rechargeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="flash" size={18} color="#fff" />
              <Text style={styles.rechargeText}>Recargar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Bs.S {balance.toFixed(2)}</Text>
          {balance < 10 && (
            <View style={styles.lowBalanceTag}>
              <Ionicons name="alert-circle" size={14} color="#fff" />
              <Text style={styles.lowBalanceText}>Saldo Bajo</Text>
            </View>
          )}
        </View>

        {/* Progress bar mejorado */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              <Ionicons name="trending-up" size={14} color="rgba(255,255,255,0.8)" /> Nivel de saldo
            </Text>
            <Text style={styles.progressValue}>
              {Math.min(Math.max((balance / 100) * 100, 0), 100).toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={['#61C9A8', '#4FB896']}
              style={[styles.progressBarFill, { width: `${Math.min(Math.max((balance / 100) * 100, 0), 100)}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      {/* Transaction History */}
      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="time-outline" size={22} color={colors.text} /> Historial de Transacciones
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="receipt-outline" size={60} color="#DFE6E9" />
            </View>
            <Text style={styles.emptyTitle}>No hay transacciones</Text>
            <Text style={styles.emptyText}>Tus transacciones aparecerán aquí</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    borderRadius: 30,
    padding: 28,
    margin: 20,
    marginBottom: 16,
    shadowColor: '#B8956A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  rechargeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#61C9A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rechargeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    gap: 6,
  },
  rechargeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceText: {
    color: colors.white,
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  lowBalanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  lowBalanceText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  progressValue: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(97, 201, 168, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(237, 155, 64, 0.1)',
    bottom: -30,
    left: -30,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 0.3,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  transactionDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  amountPositive: {
    color: colors.success,
  },
  amountNegative: {
    color: colors.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default WalletScreen;

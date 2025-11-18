import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TokenTransaction } from '../../../domain/entities/TokenTransaction';
import { TokenRepositoryImpl } from '../../../data/repositories/TokenRepositoryImpl';
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
      <Text style={styles.transactionType}>{item.type}</Text>
      <Text style={item.amount > 0 ? styles.amountPositive : styles.amountNegative}>
        {item.amount > 0 ? '+' : ''}{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance:</Text>
        <Text style={styles.balanceAmount}>{balance.toFixed(2)} Tokens</Text>
      </View>
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No transactions yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  transactionType: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  amountPositive: {
    fontSize: 16,
    color: colors.success,
  },
  amountNegative: {
    fontSize: 16,
    color: colors.danger,
  },
});

export default WalletScreen;

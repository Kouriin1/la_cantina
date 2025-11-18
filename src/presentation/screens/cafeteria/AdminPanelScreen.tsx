import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Order } from '../../../domain/entities/Order';
import { OrderRepositoryImpl } from '../../../data/repositories/OrderRepositoryImpl';
import { GetOrdersByCafeteriaUseCase } from '../../../domain/usecases/GetOrdersByCafeteriaUseCase';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const AdminPanelScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderRepository = new OrderRepositoryImpl();
        const getOrdersUseCase = new GetOrdersByCafeteriaUseCase(orderRepository);
        const result = await getOrdersUseCase.execute();
        setOrders(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAction = (orderId: string, action: 'accept' | 'reject') => {
    console.log(`Order ${orderId} ${action}ed`);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>Order from {item.student.firstName}</Text>
      <Text>Status: {item.status}</Text>
      {item.items.map(orderItem => (
        <View key={orderItem.product.id} style={styles.itemContainer}>
          <Text>{orderItem.product.name} x {orderItem.quantity}</Text>
          <Text>${(orderItem.product.price * orderItem.quantity).toFixed(2)}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: ${item.total.toFixed(2)}</Text>
      {item.status === 'approved' && (
        <View style={styles.buttonContainer}>
          <Button title="Accept" onPress={() => handleAction(item.id, 'accept')} />
          <Button title="Reject" onPress={() => handleAction(item.id, 'reject')} />
        </View>
      )}
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
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text>No orders.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 10,
  },
  orderContainer: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
});

export default AdminPanelScreen;

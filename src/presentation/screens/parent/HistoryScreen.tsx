import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { OrderRepositoryImpl } from '../../../data/repositories/OrderRepositoryImpl';
import { Order } from '../../../domain/entities/Order';
import { GetOrdersByStudentUseCase } from '../../../domain/usecases/GetOrdersByStudentUseCase';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const HistoryScreen = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.childId) return;
      try {
        const orderRepository = new OrderRepositoryImpl();
        const getOrdersUseCase = new GetOrdersByStudentUseCase(orderRepository);
        const result = await getOrdersUseCase.execute(user.childId);
        setOrders(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pendiente de Aprobación';
      case 'pending_payment': return 'Pendiente de Pago';
      case 'approved': return 'Aprobado';
      case 'rejected_by_parent': return 'Rechazado por Representante';
      case 'preparing': return 'Preparando';
      case 'ready_for_pickup': return 'Listo para Retirar';
      case 'completed': return 'Completado';
      case 'cancelled_by_cafeteria': return 'Cancelado por Cafetería';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>Orden de {item.student.firstName} - {item.createdAt.toLocaleDateString()}</Text>
      <Text>Estado: {getStatusLabel(item.status)}</Text>
      {item.items.map(orderItem => (
        <View key={orderItem.product.id} style={styles.itemContainer}>
          <Text>{orderItem.product.name} x {orderItem.quantity}</Text>
          <Text>Bs.S {(orderItem.product.price * orderItem.quantity).toFixed(2)}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: Bs.S {item.total.toFixed(2)}</Text>
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
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text>No hay historial de pedidos.</Text>}
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
});

export default HistoryScreen;

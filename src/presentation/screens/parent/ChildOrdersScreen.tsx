import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderRepositoryImpl } from '../../../data/repositories/OrderRepositoryImpl';
import { Order } from '../../../domain/entities/Order';
import { GetOrdersByStudentUseCase } from '../../../domain/usecases/GetOrdersByStudentUseCase';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';

const ChildOrdersScreen = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user || !user.childId) return;
    try {
      const orderRepository = new OrderRepositoryImpl();
      const getOrdersUseCase = new GetOrdersByStudentUseCase(orderRepository);
      const result = await getOrdersUseCase.execute(user.childId);
      setOrders(result.filter(o => o.status === 'pending_approval'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleApproval = (orderId: string, approve: boolean) => {
    // Here you would call the use case to approve/reject
    console.log(`Order ${orderId} ${approve ? 'approved' : 'rejected'}`);
    // Optimistic update for demo
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="school" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={styles.studentName}>{item.student.firstName}</Text>
            <Text style={styles.orderTime}>
              {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>Pendiente</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsList}>
        {item.items.map(orderItem => (
          <View key={orderItem.product.id} style={styles.itemRow}>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{orderItem.quantity}x</Text>
            </View>
            <Text style={styles.itemName}>{orderItem.product.name}</Text>
            <Text style={styles.itemPrice}>Bs.S {(orderItem.product.price * orderItem.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total a Pagar</Text>
          <Text style={styles.totalAmount}>Bs.S {item.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleApproval(item.id, false)}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle-outline" size={20} color="#E74C3C" />
          <Text style={styles.rejectText}>Rechazar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApproval(item.id, true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2ECC71', '#27AE60']}
            style={styles.approveGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
            <Text style={styles.approveText}>Aprobar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#B8956A', '#A67C52', '#B8956A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Solicitudes</Text>
        <Text style={styles.headerSubtitle}>Pedidos pendientes de aprobación</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <Text>Cargando solicitudes...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>¡Todo al día!</Text>
              <Text style={styles.emptySubtext}>No hay solicitudes pendientes</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pendingBadge: {
    backgroundColor: '#FEF9E7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1C40F',
  },
  pendingText: {
    fontSize: 12,
    color: '#F39C12',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBadge: {
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 10,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  cardFooter: {
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  rejectText: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  approveButton: {
    overflow: 'hidden',
  },
  approveGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  approveText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

export default ChildOrdersScreen;

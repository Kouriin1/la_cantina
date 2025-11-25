import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        // Sort by date descending
        setOrders(result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Aprobado', color: '#2ECC71', icon: 'checkmark-circle' };
      case 'pending_approval':
        return { label: 'Pendiente', color: '#F1C40F', icon: 'time' };
      case 'rejected_by_parent':
        return { label: 'Rechazado', color: '#E74C3C', icon: 'close-circle' };
      case 'completed':
        return { label: 'Completado', color: '#3498DB', icon: 'flag' };
      case 'cancelled_by_cafeteria':
        return { label: 'Cancelado', color: '#95A5A6', icon: 'ban' };
      default:
        return { label: status, color: '#95A5A6', icon: 'help-circle' };
    }
  };

  const renderItem = ({ item }: { item: Order }) => {
    const status = getStatusConfig(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconContainer, { backgroundColor: status.color + '20' }]}>
            <Ionicons name={status.icon as any} size={24} color={status.color} />
          </View>
          <View style={styles.line} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.dateText}>
              {item.createdAt.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
            </Text>
            <Text style={styles.timeText}>
              {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <Text style={styles.studentName}>Orden de {item.student.firstName}</Text>

          <View style={styles.itemsSummary}>
            <Text style={styles.itemsText} numberOfLines={1}>
              {item.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
            <Text style={styles.totalAmount}>Bs.S {item.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#B8956A', '#A67C52', '#B8956A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Historial</Text>
        <Text style={styles.headerSubtitle}>Registro de actividades</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <Text>Cargando historial...</Text>
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
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Sin historial reciente</Text>
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
  },
  cardContent: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  studentName: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  itemsSummary: {
    marginBottom: 12,
  },
  itemsText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default HistoryScreen;

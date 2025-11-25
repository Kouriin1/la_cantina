import { colors } from '@/src/presentation/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderRepositoryImpl } from '../../../data/repositories/OrderRepositoryImpl';
import { Order } from '../../../domain/entities/Order';
import { GetOrdersByCafeteriaUseCase } from '../../../domain/usecases/GetOrdersByCafeteriaUseCase';

const AdminPanelScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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
    // Here you would call a use case to update the order status
    Alert.alert('Éxito', `Orden ${action === 'accept' ? 'aceptada' : 'rechazada'} correctamente`);
  };

  const handleScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permiso denegado', 'Se necesita permiso de cámara para escanear QR');
        return;
      }
    }
    setScanning(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(false);
    Alert.alert('Código Escaneado', `Datos del estudiante: ${data}`, [
      { text: 'OK', onPress: () => console.log('Scanned:', data) }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#2ECC71';
      case 'pending_approval': return '#F1C40F';
      case 'rejected_by_parent': return '#E74C3C';
      case 'completed': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pendiente de Aprobación';
      case 'pending_payment': return 'Pendiente de Pago';
      case 'approved': return 'Aprobado';
      case 'rejected_by_parent': return 'Rechazado';
      case 'preparing': return 'Preparando';
      case 'ready_for_pickup': return 'Listo para Retirar';
      case 'completed': return 'Completado';
      case 'cancelled_by_cafeteria': return 'Cancelado';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={20} color={colors.white} />
          </View>
          <View>
            <Text style={styles.studentName}>{item.student.firstName}</Text>
            <Text style={styles.orderDate}>
              {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsList}>
        {item.items.map(orderItem => (
          <View key={orderItem.product.id} style={styles.orderItem}>
            <View style={styles.itemQuantity}>
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
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>Bs.S {item.total.toFixed(2)}</Text>
        </View>

        {item.status === 'approved' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleAction(item.id, 'reject')}
            >
              <Ionicons name="close" size={20} color="#E74C3C" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.acceptBtn]}
              onPress={() => handleAction(item.id, 'accept')}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.acceptBtnText}>Entregar</Text>
            </TouchableOpacity>
          </View>
        )}
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Pedidos</Text>
            <Text style={styles.headerSubtitle}>Gestiona las órdenes del día</Text>
          </View>
          <TouchableOpacity style={styles.scanButton} onPress={handleScan} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.secondary, '#E67E22']}
              style={styles.scanGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="qr-code" size={24} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.centered}>
          <Text>Cargando pedidos...</Text>
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
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No hay pedidos pendientes</Text>
            </View>
          }
        />
      )}

      <Modal visible={scanning} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setScanning(false)}>
                <View style={styles.closeButtonCircle}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </View>
              </TouchableOpacity>
              <View style={styles.scanFrameContainer}>
                <View style={styles.scanFrame} />
                <Text style={styles.scanText}>Escanea el código QR del estudiante</Text>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scanButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  itemsList: {
    gap: 8,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  rejectBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E74C3C',
    width: 40,
    paddingHorizontal: 0,
  },
  acceptBtn: {
    backgroundColor: '#2ECC71',
    gap: 6,
  },
  acceptBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameContainer: {
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: 'transparent',
    marginBottom: 20,
    borderRadius: 20,
  },
  scanText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AdminPanelScreen;

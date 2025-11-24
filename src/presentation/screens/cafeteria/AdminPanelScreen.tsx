import Button from '@/src/presentation/components/Button';
import { colors } from '@/src/presentation/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pendiente de Aprobación';
      case 'pending_payment': return 'Pendiente de Pago';
      case 'approved': return 'Aprobado';
      case 'rejected_by_parent': return 'Rechazado por Representante';
      case 'preparing': return 'Preparando';
      case 'ready_for_pickup': return 'Listo para Retirar';
      case 'completed': return 'Completado';
      case 'cancelled_by_cafeteria': return 'Cancelado por Cantina';
      default: return status;
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>Orden de {item.student.firstName}</Text>
      <Text style={styles.statusText}>Estado: {getStatusLabel(item.status)}</Text>
      {item.items.map(orderItem => (
        <View key={orderItem.product.id} style={styles.itemContainer}>
          <Text>{orderItem.product.name} x {orderItem.quantity}</Text>
          <Text>Bs.S {(orderItem.product.price * orderItem.quantity).toFixed(2)}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: Bs.S {item.total.toFixed(2)}</Text>
      {item.status === 'approved' && (
        <View style={styles.buttonContainer}>
          <Button title="Aceptar" onPress={() => handleAction(item.id, 'accept')} style={styles.acceptButton} />
          <Button title="Rechazar" onPress={() => handleAction(item.id, 'reject')} style={styles.rejectButton} />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Ionicons name="qr-code-outline" size={24} color={colors.white} />
          <Text style={styles.scanButtonText}>Escanear QR</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay pedidos pendientes.</Text>}
      />

      <Modal visible={scanning} animationType="slide">
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
                <Ionicons name="close" size={30} color={colors.white} />
              </TouchableOpacity>
              <View style={styles.scanFrame} />
              <Text style={styles.scanText}>Escanea el código QR del estudiante</Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: colors.white,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  orderContainer: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.danger,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textSecondary,
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
    top: 40,
    right: 20,
    padding: 10,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.secondary,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  scanText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdminPanelScreen;

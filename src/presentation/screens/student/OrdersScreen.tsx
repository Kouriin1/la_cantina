import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Order, useOrdersStore } from '../../state/ordersStore';
import { colors } from '../../theme/colors';

const OrdersScreen = () => {
    const { orders } = useOrdersStore();

    const renderOrderItem = ({ item }: { item: Order }) => {
        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderDate}>{item.date}</Text>
                        <Text style={styles.orderId}>Pedido #{item.id.slice(-6)}</Text>
                    </View>
                    <View style={[styles.statusBadge, {
                        backgroundColor: item.status === 'approved' ? '#2ECC71' : item.status === 'rejected' ? '#E74C3C' : '#F39C12'
                    }]}>
                        <Text style={styles.statusText}>
                            {item.status === 'approved' ? 'Aprobado' : item.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                        </Text>
                    </View>
                </View>

                <View style={styles.orderItems}>
                    {item.items.map((orderItem, index) => (
                        <View key={index} style={styles.productRow}>
                            <Text style={styles.productName}>{orderItem.product.name}</Text>
                            <Text style={styles.productQuantity}>x{orderItem.quantity}</Text>
                            <Text style={styles.productPrice}>Bs.S {(orderItem.product.price * orderItem.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>Bs.S {item.total.toFixed(2)}</Text>
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
                <View style={StyleSheet.absoluteFill}>
                    <Ionicons name="receipt" size={80} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: -20, top: -10 }} />
                    <Ionicons name="checkmark-circle" size={60} color="rgba(255,255,255,0.08)" style={{ position: 'absolute', left: -10, bottom: -10 }} />
                </View>

                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Mis Pedidos</Text>
                    <Text style={styles.headerSubtitle}>Historial de compras</Text>
                </View>
            </LinearGradient>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#DFE6E9" />
                    <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
                    <Text style={styles.emptyText}>Tus pedidos aparecerán aquí cuando realices una compra</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 20,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    listContainer: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    orderDate: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderItems: {
        marginBottom: 12,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    productName: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },
    productQuantity: {
        fontSize: 14,
        color: colors.textSecondary,
        marginHorizontal: 12,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.secondary,
    },
});

export default OrdersScreen;

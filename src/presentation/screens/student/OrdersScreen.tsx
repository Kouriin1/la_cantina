import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Order, useOrdersStore } from '../../state/ordersStore';
import { colors } from '../../theme/colors';

const OrdersScreen = () => {
    const { orders } = useOrdersStore();
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const filteredOrders = orders.filter(order => {
        if (selectedFilter === 'all') return true;
        return order.status === selectedFilter;
    });

    const renderOrderItem = ({ item }: { item: Order }) => {
        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderDate}>{item.date}</Text>
                        <Text style={styles.orderId}>Pedido #{item.id.slice(-6)}</Text>
                    </View>
                    <View style={[styles.statusBadge, {
                        backgroundColor: item.status === 'approved' ? '#2ECC71' : item.status === 'rejected_by_parent' ? '#E74C3C' : '#F39C12'
                    }]}>
                        <Text style={styles.statusText}>
                            {item.status === 'approved' ? 'Aprobado' : item.status === 'rejected_by_parent' ? 'Rechazado' : 'Pendiente'}
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

                {item.status === 'rejected_by_parent' && item.rejectionNote && (
                    <View style={styles.rejectionNoteContainer}>
                        <View style={styles.rejectionHeader}>
                            <Ionicons name="alert-circle" size={18} color="#E74C3C" />
                            <Text style={styles.rejectionTitle}>Motivo del rechazo:</Text>
                        </View>
                        <Text style={styles.rejectionNote}>{item.rejectionNote}</Text>
                    </View>
                )}

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

            {orders.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
                        onPress={() => setSelectedFilter('all')}
                    >
                        <Ionicons name="apps" size={16} color={selectedFilter === 'all' ? '#fff' : colors.textSecondary} />
                        <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.filterChipTextActive]}>Todos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'pending_approval' && styles.filterChipActive]}
                        onPress={() => setSelectedFilter('pending_approval')}
                    >
                        <Ionicons name="time" size={16} color={selectedFilter === 'pending_approval' ? '#fff' : colors.textSecondary} />
                        <Text style={[styles.filterChipText, selectedFilter === 'pending_approval' && styles.filterChipTextActive]}>Pendientes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'approved' && styles.filterChipActive]}
                        onPress={() => setSelectedFilter('approved')}
                    >
                        <Ionicons name="checkmark-circle" size={16} color={selectedFilter === 'approved' ? '#fff' : colors.textSecondary} />
                        <Text style={[styles.filterChipText, selectedFilter === 'approved' && styles.filterChipTextActive]}>Aprobados</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, selectedFilter === 'rejected_by_parent' && styles.filterChipActive]}
                        onPress={() => setSelectedFilter('rejected_by_parent')}
                    >
                        <Ionicons name="close-circle" size={16} color={selectedFilter === 'rejected_by_parent' ? '#fff' : colors.textSecondary} />
                        <Text style={[styles.filterChipText, selectedFilter === 'rejected_by_parent' && styles.filterChipTextActive]}>Rechazados</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            {filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#DFE6E9" />
                    <Text style={styles.emptyTitle}>
                        {selectedFilter === 'all' ? 'No tienes pedidos aún' : 'No hay pedidos en esta categoría'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {selectedFilter === 'all'
                            ? 'Tus pedidos aparecerán aquí cuando realices una compra'
                            : 'Cambia el filtro para ver otros pedidos'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
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
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        paddingTop: 50,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: { zIndex: 1 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
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
    emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
    listContainer: { padding: 20 },
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
    orderDate: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
    orderId: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    orderItems: { marginBottom: 12 },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    productName: { flex: 1, fontSize: 14, color: colors.text },
    productQuantity: { fontSize: 14, color: colors.textSecondary, marginHorizontal: 12 },
    productPrice: { fontSize: 14, fontWeight: '600', color: colors.text },
    rejectionNoteContainer: {
        backgroundColor: '#FFEBEE',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#E74C3C',
    },
    rejectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    rejectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#E74C3C',
    },
    rejectionNote: {
        fontSize: 14,
        color: '#C62828',
        lineHeight: 20,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    totalAmount: { fontSize: 18, fontWeight: 'bold', color: colors.secondary },
    filtersContainer: { paddingHorizontal: 20, marginTop: 12, marginBottom: 10 },
    filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8', gap: 6 },
    filterChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
    filterChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    filterChipTextActive: { color: '#fff', fontWeight: 'bold' },
});

export default OrdersScreen;

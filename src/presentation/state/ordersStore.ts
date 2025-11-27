import { create } from 'zustand';
import { Product } from '../../domain/entities/Product';

export interface OrderItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'approved' | 'rejected' | 'rejected_by_parent' | 'pending_approval' | 'pending_payment';
    rejectionNote?: string;
}

interface OrdersState {
    orders: Order[];
    addOrder: (items: OrderItem[], total: number) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
    orders: [],

    addOrder: (items, total) => {
        const newOrder: Order = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            items,
            total,
            status: 'pending',
        };

        set((state) => ({
            orders: [newOrder, ...state.orders],
        }));
    },

    updateOrderStatus: (orderId, status) => {
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, status } : order
            ),
        }));
    },
}));

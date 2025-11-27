import { Order } from '../entities/Order';

export interface OrderRepository {
  getOrdersByStudent(studentId: string): Promise<Order[]>;
  getOrdersByCafeteria(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateOrderStatus(orderId: string, status: Order['status']): Promise<Order>;
  updateOrderWithRejection(orderId: string, rejectionNote: string): Promise<Order>;
}

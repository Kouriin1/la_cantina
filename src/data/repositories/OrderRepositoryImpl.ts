import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { Order } from '../../domain/entities/Order';
import mockApi from '../services/ApiService';
import { OrderModel, toOrder } from '../models/OrderModel';
import { UserModel } from '../models/UserModel';

const mockStudent: UserModel = {
  id: 'student1',
  email: 'student@test.com',
  role: 'student',
  firstName: 'Student',
  lastName: 'User',
  parentId: 'parent1',
};

const mockOrders: OrderModel[] = [
  {
    id: 'order1',
    student: mockStudent,
    items: [
      { product: { id: '1', name: 'Hamburger', description: 'A delicious hamburger', price: 5.99, cost: 2.5, stock: 100 }, quantity: 1 },
      { product: { id: '2', name: 'Fries', description: 'Crispy french fries', price: 2.99, cost: 1, stock: 200 }, quantity: 1 },
    ],
    total: 8.98,
    status: 'pending_approval',
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  },
];

export class OrderRepositoryImpl implements OrderRepository {
  async getOrdersByStudent(studentId: string): Promise<Order[]> {
    console.log('Getting orders for student', studentId);
    const response = await mockApi(mockOrders);
    return response.map(toOrder);
  }

  async getOrdersByCafeteria(): Promise<Order[]> {
    const response = await mockApi(mockOrders);
    return response.map(toOrder);
  }

  async getOrderById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    throw new Error('Method not implemented.');
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    throw new Error('Method not implemented.');
  }
}

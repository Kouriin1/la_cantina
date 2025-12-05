import { Product } from './Product';
import { User } from './User';

export type OrderStatus = 'pending_approval' | 'pending_payment' | 'approved' | 'rejected_by_parent' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled_by_cafeteria';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  student: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  rejectionNote?: string;
}

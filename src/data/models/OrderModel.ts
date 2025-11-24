import { Order, OrderItem, OrderStatus } from '../../domain/entities/Order';
import { toProduct, fromProduct, ProductModel } from './ProductModel';
import { toUser, fromUser, UserModel } from './UserModel';

export interface OrderItemModel {
  product: ProductModel;
  quantity: number;
}

export interface OrderModel {
  id: string;
  student: UserModel;
  items: OrderItemModel[];
  total: number;
  status: OrderStatus;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export const toOrder = (orderModel: OrderModel): Order => ({
  id: orderModel.id,
  student: toUser(orderModel.student),
  items: orderModel.items.map(item => ({
    product: toProduct(item.product),
    quantity: item.quantity,
  })),
  total: orderModel.total,
  status: orderModel.status,
  createdAt: new Date(orderModel.createdAt),
  updatedAt: new Date(orderModel.updatedAt),
});

export const fromOrder = (order: Order): OrderModel => ({
  id: order.id,
  student: fromUser(order.student),
  items: order.items.map(item => ({
    product: fromProduct(item.product),
    quantity: item.quantity,
  })),
  total: order.total,
  status: order.status,
  createdAt: order.createdAt.getTime(),
  updatedAt: order.updatedAt.getTime(),
});

import { Order, OrderStatus } from '../../domain/entities/Order';
import { fromProduct, ProductModel, toProduct } from './ProductModel';
import { fromUser, toUser, UserModel } from './UserModel';

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
  rejectionNote?: string;
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
  rejectionNote: orderModel.rejectionNote,
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
  rejectionNote: order.rejectionNote,
});

import { OrderRepository } from '../repositories/OrderRepository';
import { Order } from '../entities/Order';

export class GetOrdersByCafeteriaUseCase {
  constructor(private orderRepository: OrderRepository) {}

  execute(): Promise<Order[]> {
    return this.orderRepository.getOrdersByCafeteria();
  }
}

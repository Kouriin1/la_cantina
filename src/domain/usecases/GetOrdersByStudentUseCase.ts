import { OrderRepository } from '../repositories/OrderRepository';
import { Order } from '../entities/Order';

export class GetOrdersByStudentUseCase {
  constructor(private orderRepository: OrderRepository) {}

  execute(studentId: string): Promise<Order[]> {
    return this.orderRepository.getOrdersByStudent(studentId);
  }
}

import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../entities/Product';

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.productRepository.getProducts();
  }
}

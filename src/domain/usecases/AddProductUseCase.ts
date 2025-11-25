import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class AddProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(product: Omit<Product, 'id'>): Promise<Product> {
        return this.productRepository.addProduct(product);
    }
}

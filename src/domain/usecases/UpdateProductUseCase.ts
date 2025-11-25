import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class UpdateProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(product: Product): Promise<Product> {
        return this.productRepository.updateProduct(product);
    }
}

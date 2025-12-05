import { ProductRepository } from '../repositories/ProductRepository';

export class DeleteProductUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(id: string): Promise<void> {
        return this.productRepository.deleteProduct(id);
    }
}

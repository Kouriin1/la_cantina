import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';
import mockApi from '../services/ApiService';
import { ProductModel, toProduct } from '../models/ProductModel';

export class ProductRepositoryImpl implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    const mockProducts: ProductModel[] = [
      { id: '1', name: 'Hamburger', description: 'A delicious hamburger', price: 5.99, cost: 2.5, stock: 100, imageUrl: 'https://via.placeholder.com/150' },
      { id: '2', name: 'Fries', description: 'Crispy french fries', price: 2.99, cost: 1, stock: 200, imageUrl: 'https://via.placeholder.com/150' },
      { id: '3', name: 'Soda', description: 'A refreshing soda', price: 1.99, cost: 0.5, stock: 300, imageUrl: 'https://via.placeholder.com/150' },
    ];
    const response = await mockApi(mockProducts);
    return response.map(toProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  async updateProduct(product: Product): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  async deleteProduct(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

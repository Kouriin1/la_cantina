import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductModel, toProduct } from '../models/ProductModel';
import mockApi from '../services/ApiService';

export class ProductRepositoryImpl implements ProductRepository {
  // Simulating a database in memory
  private static products: ProductModel[] = [
    { id: '1', name: 'Hamburguesa', description: 'Deliciosa hamburguesa con queso', price: 5.99, cost: 2.5, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: '2', name: 'Papas Fritas', description: 'Papas fritas crujientes', price: 2.99, cost: 1, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500' },
    { id: '3', name: 'Refresco', description: 'Refresco refrescante', price: 1.99, cost: 0.5, stock: 300, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500' },
    { id: '4', name: 'Pizza', description: 'Rebanada de pizza de pepperoni', price: 3.50, cost: 1.5, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500' },
  ];

  async getProducts(): Promise<Product[]> {
    const response = await mockApi(ProductRepositoryImpl.products);
    return response.map(toProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = ProductRepositoryImpl.products.find(p => p.id === id);
    return product ? toProduct(product) : null;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: ProductModel = {
      id: Math.random().toString(36).substr(2, 9),
      ...product,
      cost: 0, // Default cost if not provided
    };
    ProductRepositoryImpl.products.push(newProduct);
    await mockApi(newProduct); // Simulate network delay
    return toProduct(newProduct);
  }

  async updateProduct(product: Product): Promise<Product> {
    const index = ProductRepositoryImpl.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      ProductRepositoryImpl.products[index] = { ...ProductRepositoryImpl.products[index], ...product };
      await mockApi(ProductRepositoryImpl.products[index]);
      return toProduct(ProductRepositoryImpl.products[index]);
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id: string): Promise<void> {
    const index = ProductRepositoryImpl.products.findIndex(p => p.id === id);
    if (index !== -1) {
      ProductRepositoryImpl.products.splice(index, 1);
      await mockApi(true);
    } else {
      throw new Error('Product not found');
    }
  }
}

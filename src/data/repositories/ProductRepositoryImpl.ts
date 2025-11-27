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
    { id: '5', name: 'Empanada de Carne', description: 'Empanada frita rellena de carne molida', price: 1.50, cost: 0.8, stock: 150, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500' },
    { id: '6', name: 'Cachito de Jamón', description: 'Panecillo relleno de jamón ahumado', price: 2.00, cost: 1.0, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500' },
    { id: '7', name: 'Arepa Reina Pepiada', description: 'Arepa rellena de pollo y aguacate', price: 3.00, cost: 1.8, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500' },
    { id: '8', name: 'Tequeños (5 unidades)', description: 'Dedos de queso empanizados', price: 2.50, cost: 1.2, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500' },
    { id: '9', name: 'Malta', description: 'Bebida de malta dulce carbonatada', price: 1.50, cost: 0.8, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500' },
    { id: '10', name: 'Papas Pringles', description: 'Lata pequeña de papas originales', price: 2.50, cost: 1.5, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500' },
    { id: '11', name: 'Torta de Chocolate', description: 'Porción de torta húmeda de chocolate', price: 3.50, cost: 1.5, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500' },
    { id: '12', name: 'Donas Glaseadas', description: 'Dona clásica con glaseado de azúcar', price: 1.20, cost: 0.5, stock: 90, imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500' },
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

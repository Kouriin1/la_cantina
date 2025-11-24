import { Product } from '../../domain/entities/Product';

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  imageUrl?: string;
  stock: number;
}

export const toProduct = (productModel: ProductModel): Product => ({
  id: productModel.id,
  name: productModel.name,
  description: productModel.description,
  price: productModel.price,
  cost: productModel.cost,
  imageUrl: productModel.imageUrl,
  stock: productModel.stock,
});

export const fromProduct = (product: Product): ProductModel => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  cost: product.cost,
  imageUrl: product.imageUrl,
  stock: product.stock,
});

import { Product } from '@app/core/entities/product';

export interface ProductsRepository {
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
}

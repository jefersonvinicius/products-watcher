import { Product } from '@app/core/entities/product';
import { Pagination } from '@app/shared/pagination';

export interface ProductsRepository {
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }>;
}

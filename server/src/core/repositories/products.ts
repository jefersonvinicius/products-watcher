import { Product, ProductSnapshot } from '@app/core/entities/product';
import { Pagination } from '@app/shared/pagination';

export interface ProductsRepository {
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'prices'>): Promise<Product>;
  findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }>;
  updateWithSnapshotData(product: Product, snapshot: ProductSnapshot): Promise<Product>;
}

import { Product, ProductSnapshot } from '@app/core/entities/product';
import { Pagination } from '@app/shared/pagination';

export type UpdateWithSnapshotParams = {
  productId: number;
  snapshot: ProductSnapshot;
};

export interface ProductsRepository {
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'prices'>): Promise<Product>;
  findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }>;
  findById(productId: number): Promise<Product | null>;
  addProductPriceFromSnapshot(params: UpdateWithSnapshotParams): Promise<Product>;
}

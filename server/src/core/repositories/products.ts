import { Product, ProductSnapshot } from '@app/core/entities/product';
import { DateRange } from '@app/shared/date-range';
import { Pagination } from '@app/shared/pagination';

export type UpdateWithSnapshotParams = {
  productId: number;
  snapshot: ProductSnapshot;
};

export type FindByIdWithPricesFilteredParams = {
  productId: number;
  dateRange: DateRange;
};

export type FindByIdWithPricesFilteredResult = {
  product: Product;
  productPricesTotal: number;
};

export interface ProductsRepository {
  save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'prices'>): Promise<Product>;
  findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }>;
  findById(productId: number): Promise<Product | null>;
  addProductPriceFromSnapshot(params: UpdateWithSnapshotParams): Promise<Product>;
  findByIdWithPricesFiltered(params: FindByIdWithPricesFilteredParams): Promise<FindByIdWithPricesFilteredResult>;
}

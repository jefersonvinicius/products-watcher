import { ProductSnapshot } from '@app/core/entities/product';

export interface ScrappingCache {
  set(url: string, snapshot: ProductSnapshot): Promise<void>;
  get(url: string): Promise<ProductSnapshot | null>;
}

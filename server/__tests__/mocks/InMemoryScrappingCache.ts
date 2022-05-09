import { ProductSnapshot } from '@app/core/entities/product';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';

export class InMemoryScrappingCache implements ScrappingCache {
  private snapshots = new Map<string, ProductSnapshot>();

  async set(url: string, snapshot: ProductSnapshot): Promise<void> {
    this.snapshots.set(url, snapshot);
  }
  async get(url: string): Promise<ProductSnapshot | null> {
    return this.snapshots.get(url) ?? null;
  }
}

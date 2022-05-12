import { ProductSnapshot } from '@app/core/entities/product';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';
import NodeCache from 'node-cache';

const EXPIRES_IN = 5000;

export class ScrappingCacheNodeCache implements ScrappingCache {
  constructor(private nodeCache: NodeCache) {}

  async set(url: string, snapshot: ProductSnapshot): Promise<void> {
    this.nodeCache.set(url, JSON.stringify(snapshot), EXPIRES_IN);
  }

  async get(url: string): Promise<ProductSnapshot | null> {
    const data = this.nodeCache.get<string>(url);
    return data ? JSON.parse(data) : null;
  }
}

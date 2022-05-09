import { ProductSnapshot } from '@app/core/entities/product';
import { Scrapper } from '@app/scrappers';
import { InMemoryScrappingCache } from '@tests/mocks/InMemoryScrappingCache';

export class FakeScrapper implements Scrapper {
  cache = new InMemoryScrappingCache();
  snapshots = new Map<string, ProductSnapshot>();

  async scrapAndCache(url: string): Promise<ProductSnapshot> {
    const snapshot = this.snapshots.get(url)!;
    this.cache.set(url, snapshot);
    return snapshot;
  }

  async scrap(url: string): Promise<ProductSnapshot> {
    return this.snapshots.get(url)!;
  }
}

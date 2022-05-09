import { ProductSnapshot } from '@app/core/entities/product';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';
import { RedisClientType } from '@redis/client';

const EXPIRES_IN = 5000;

export class ScrappingCacheRedis implements ScrappingCache {
  constructor(private client: RedisClientType) {}

  async set(url: string, snapshot: ProductSnapshot): Promise<void> {
    await this.client.connect();
    await this.client.set(url, JSON.stringify(snapshot), { EX: EXPIRES_IN });
  }

  async get(url: string): Promise<ProductSnapshot | null> {
    await this.client.connect();
    const data = await this.client.get(url);
    return data ? JSON.parse(data) : null;
  }
}

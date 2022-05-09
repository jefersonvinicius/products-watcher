import { ProductSnapshot } from '@app/core/entities/product';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';
import { RedisClientType } from '@redis/client';
import { RedisFunctions, RedisModules, RedisScripts } from 'redis';

const EXPIRES_IN = 5000;

export class ScrappingCacheRedis implements ScrappingCache {
  constructor(private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>) {}

  async set(url: string, snapshot: ProductSnapshot): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    await this.client.set(url, JSON.stringify(snapshot), { EX: EXPIRES_IN });
  }

  async get(url: string): Promise<ProductSnapshot | null> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    const data = await this.client.get(url);
    return data ? JSON.parse(data) : null;
  }
}

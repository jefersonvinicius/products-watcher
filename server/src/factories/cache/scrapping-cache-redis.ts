import { redisClient } from '@app/infra/cache/redis-client';
import { ScrappingCacheRedis } from '@app/infra/cache/scrapping-cache-redis';

export function makeScrappingCacheRedis() {
  return new ScrappingCacheRedis(redisClient);
}

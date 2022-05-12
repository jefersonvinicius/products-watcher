import { nodeCache } from '@app/infra/cache/node-cache-client';
import { ScrappingCacheNodeCache } from '@app/infra/cache/scrapping-cache-node-cache';

export function makeScrappingCache() {
  return new ScrappingCacheNodeCache(nodeCache);
}

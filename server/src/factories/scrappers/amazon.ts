import { makeScrappingCacheRedis } from '@app/factories/cache/scrapping-cache-redis';
import { AmazonScrapper } from '@app/scrappers/amazon';

export function makeAmazonScrapper() {
  return new AmazonScrapper(makeScrappingCacheRedis());
}

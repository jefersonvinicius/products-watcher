import { makeScrappingCache } from '@app/factories/cache/scrapping-cache';
import { AmazonScrapper } from '@app/scrappers/amazon';

export function makeAmazonScrapper() {
  return new AmazonScrapper(makeScrappingCache());
}

import { CheckProductPriceUseCase } from '@app/core/use-cases/check-product-price-usecase';
import { makeScrappingCacheRedis } from '@app/factories/cache/scrapping-cache-redis';
import { makeProductsRepository } from '@app/factories/repositories/products';
import { makeAmazonScrapper } from '@app/factories/scrappers/amazon';

export function makeCheckProductPriceUseCase() {
  return new CheckProductPriceUseCase(makeAmazonScrapper(), makeProductsRepository(), makeScrappingCacheRedis());
}

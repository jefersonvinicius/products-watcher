import { CheckProductPriceUseCase } from '@app/core/use-cases/check-product-price-usecase';
import { makeScrappingCache } from '@app/factories/cache/scrapping-cache';
import { makeMailBox } from '@app/factories/mailing/mail-box';
import { makeAlertsRepository } from '@app/factories/repositories/alerts';
import { makeProductsRepository } from '@app/factories/repositories/products';
import { makeAmazonScrapper } from '@app/factories/scrappers/amazon';

export function makeCheckProductPriceUseCase() {
  return new CheckProductPriceUseCase(
    makeAmazonScrapper(),
    makeProductsRepository(),
    makeAlertsRepository(),
    makeScrappingCache(),
    makeMailBox()
  );
}

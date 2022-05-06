import { SaveProductUseCase } from '@app/core/use-cases/save-product-usecase';
import { makeProductsRepository } from '@app/factories/repositories/products';
import { makeAmazonScrapper } from '@app/factories/scrappers/amazon';

export function makeSaveProductUseCase() {
  return new SaveProductUseCase(makeAmazonScrapper(), makeProductsRepository());
}

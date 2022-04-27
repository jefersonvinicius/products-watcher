import { SavePageUseCase } from '@app/core/use-cases/save-page-usecase';
import { makeProductsRepository } from '@app/factories/repositories/products';
import { makeAmazonScrapper } from '@app/factories/scrappers/amazon';

export function makeSavePageUseCase() {
  return new SavePageUseCase(makeAmazonScrapper(), makeProductsRepository());
}

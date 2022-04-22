import { ScrapPageUseCase } from '@app/core/use-cases/scrap-page-usecase';
import { makeAmazonScrapper } from '@app/factories/scrappers/amazon';

export function makeScrapUseCase() {
  return new ScrapPageUseCase(makeAmazonScrapper());
}

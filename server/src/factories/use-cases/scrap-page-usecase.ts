import { ScrapPageUseCase } from '@app/core/use-cases/scrap-page-usecase';
import { makeAmazonScrapper } from '@app/factories/scrappers/amazon';

export function makeScrapPageUseCase() {
  return new ScrapPageUseCase(makeAmazonScrapper());
}

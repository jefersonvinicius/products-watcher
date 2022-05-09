import { ProductSnapshot } from '@app/core/entities/product';
import { UseCase } from '@app/core/use-cases';
import { Scrapper } from '@app/scrappers';

type ScrapPageParams = {
  url: string;
};

type ScrapPageResult = {
  product: ProductSnapshot;
};

export class ScrapPageUseCase implements UseCase<ScrapPageParams, ScrapPageResult> {
  constructor(private scrapper: Scrapper) {}

  async perform(params: ScrapPageParams): Promise<ScrapPageResult> {
    const scrapped = await this.scrapper.scrapAndCache(params.url);
    return { product: scrapped };
  }
}

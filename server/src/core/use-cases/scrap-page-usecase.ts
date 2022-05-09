import { ProductSnapshot } from '@app/core/entities/product';
import { UseCase } from '@app/core/use-cases';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';
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
    // await this.scrappingCache.set(params.url, scrapped);
    return { product: scrapped };
  }
}

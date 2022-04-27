import { ProductSnapshot } from '@app/core/entities/product';
import { Scrapper } from '@app/scrappers';

export class FakeScrapper implements Scrapper {
  async scrap(url: string): Promise<ProductSnapshot> {
    return {} as ProductSnapshot;
  }
}

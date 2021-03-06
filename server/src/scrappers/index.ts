import { ProductSnapshot } from '@app/core/entities/product';

export interface Scrapper {
  scrap(url: string): Promise<ProductSnapshot>;
  scrapAndCache(url: string): Promise<ProductSnapshot>;
}

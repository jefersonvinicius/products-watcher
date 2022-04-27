import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { Scrapper } from '@app/scrappers';

type SavePageParams = {
  url: string;
};

type SavePageResult = {
  product: Product;
};

export class SavePageUseCase implements UseCase<SavePageParams, SavePageResult> {
  constructor(private scrapper: Scrapper, private productsRepository: ProductsRepository) {}

  async perform(params: SavePageParams): Promise<SavePageResult> {
    const scrapped = await this.scrapper.scrap(params.url);
    const saved = await this.productsRepository.save(scrapped);
    return { product: saved };
  }
}

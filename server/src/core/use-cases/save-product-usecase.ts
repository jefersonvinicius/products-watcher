import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { Scrapper } from '@app/scrappers';

type SaveProductParams = {
  url: string;
};

type SaveProductResult = {
  product: Product;
};

export class SaveProductUseCase implements UseCase<SaveProductParams, SaveProductResult> {
  constructor(private scrapper: Scrapper, private productsRepository: ProductsRepository) {}

  async perform(params: SaveProductParams): Promise<SaveProductResult> {
    const scrapped = await this.scrapper.scrap(params.url);
    const saved = await this.productsRepository.save(scrapped);
    return { product: saved };
  }
}

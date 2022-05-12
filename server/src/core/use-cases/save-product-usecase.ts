import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { ScrappingCache } from '@app/infra/cache/scrapping-cache';
import { Scrapper } from '@app/scrappers';

type SaveProductParams = {
  url: string;
};

type SaveProductResult = {
  product: Product;
};

export class SaveProductUseCase implements UseCase<SaveProductParams, SaveProductResult> {
  constructor(
    private scrapper: Scrapper,
    private scrappingCache: ScrappingCache,
    private productsRepository: ProductsRepository
  ) {}

  async perform(params: SaveProductParams): Promise<SaveProductResult> {
    let snapshot = await this.scrappingCache.get(params.url);
    if (!snapshot) {
      snapshot = await this.scrapper.scrapAndCache(params.url);
    }

    const product = Product.withDefaults({ ...snapshot, id: undefined, alerts: undefined, prices: undefined });
    const saved = await this.productsRepository.save(product);
    return { product: saved };
  }
}

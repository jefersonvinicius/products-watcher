import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { Scrapper } from '@app/scrappers';

type CheckProductPriceParams = {
  product: Product;
};

type CheckProductPriceResult = {
  product: Product;
};

export class CheckProductPriceUseCase implements UseCase<CheckProductPriceParams, CheckProductPriceResult> {
  constructor(private scrapper: Scrapper, private productsRepository: ProductsRepository) {}

  async perform(params: CheckProductPriceParams): Promise<CheckProductPriceResult> {
    const snapshot = await this.scrapper.scrap(params.product.url);
    const product = await this.productsRepository.updateWithSnapshotData(params.product, snapshot);
    return { product };
  }
}

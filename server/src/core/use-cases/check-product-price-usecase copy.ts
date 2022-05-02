import { Product, ProductNotFound } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { Scrapper } from '@app/scrappers';

type CheckProductPriceParams = {
  productId: number;
};

type CheckProductPriceResult = {
  product: Product;
};

export class CheckProductPriceUseCase implements UseCase<CheckProductPriceParams, CheckProductPriceResult> {
  constructor(private scrapper: Scrapper, private productsRepository: ProductsRepository) {}

  async perform(params: CheckProductPriceParams): Promise<CheckProductPriceResult> {
    const productSaved = await this.productsRepository.findById(params.productId);
    if (!productSaved) throw new ProductNotFound(params.productId);
    const snapshot = await this.scrapper.scrap(productSaved.url);
    const product = await this.productsRepository.addProductPriceFromSnapshot({
      productId: params.productId,
      snapshot,
    });
    return { product };
  }
}

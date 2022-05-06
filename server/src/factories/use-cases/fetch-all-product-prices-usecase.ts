import { FetchAllProductPricesUseCase } from '@app/core/use-cases/fetch-all-product-prices-usecase';
import { makeProductsRepository } from '@app/factories/repositories/products';

export function makeFetchAllProductPricesUseCase() {
  return new FetchAllProductPricesUseCase(makeProductsRepository());
}

import { FetchAllProductsUseCase } from '@app/core/use-cases/fetch-all-products-usecase copy';
import { makeProductsRepository } from '@app/factories/repositories/products';

export function makeFetchAllProductsUseCase() {
  return new FetchAllProductsUseCase(makeProductsRepository());
}

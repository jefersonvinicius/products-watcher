import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { Scrapper } from '@app/scrappers';
import { Pagination } from '@app/shared/pagination';

type FetchAllProductsParams = {
  pagination: Pagination;
};

type FetchAllProductsResult = {
  products: Product[];
  total: number;
};

export class FetchAllProductsUseCase implements UseCase<FetchAllProductsParams, FetchAllProductsResult> {
  constructor(private productsRepository: ProductsRepository) {}

  async perform(params: FetchAllProductsParams): Promise<FetchAllProductsResult> {
    const result = await this.productsRepository.findAll({ pagination: params.pagination });
    return result;
  }
}

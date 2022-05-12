import { Product, ProductNotFound } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';
import { DateRange, DateRangeFilter } from '@app/shared/date-range';

type FetchAllProductPricesParams = {
  productId: number;
  dateFilter: DateRangeFilter;
};

type FetchAllProductPricesResult = {
  product: Product;
  total: number;
};

export class FetchAllProductPricesUseCase implements UseCase<FetchAllProductPricesParams, FetchAllProductPricesResult> {
  constructor(private productRepository: ProductsRepository) {}

  async perform(params: FetchAllProductPricesParams): Promise<FetchAllProductPricesResult> {
    const result = await this.productRepository.findByIdWithPricesFiltered({
      productId: params.productId,
      dateRange: DateRange.fromFilter(params.dateFilter),
    });
    if (!result.product) throw new ProductNotFound(params.productId);
    return { product: result.product, total: result.productPricesTotal };
  }
}

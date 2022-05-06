import { FetchAllProductPricesUseCase } from '@app/core/use-cases/fetch-all-product-prices-usecase';
import { Clock } from '@app/shared/clock';
import { DateRangeFilter } from '@app/shared/date-range';
import { Pagination } from '@app/shared/pagination';
import { createFakeProduct } from '@tests/helpers/factories/product';
import { createFakeProductPrice } from '@tests/helpers/factories/product-price';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';

function createSut() {
  const productRepository = new InMemoryProductsRepository();
  const sut = new FetchAllProductPricesUseCase(productRepository);
  return { sut, productRepository };
}

describe('FetchAllProductPricesUseCase', () => {
  it('should be created', () => {
    const { sut } = createSut();
    expect(sut).toBeTruthy();
  });

  it('should get product prices within range date provided', async () => {
    const { sut, productRepository } = createSut();
    jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-05-11T10:00:00.000Z'));
    const price1 = createFakeProductPrice({ productId: 1, pricedAt: new Date('2022-05-10T10:00:00.000Z') });
    const price2 = createFakeProductPrice({ productId: 1, pricedAt: new Date('2022-05-02T10:00:00.000Z') });
    const price3 = createFakeProductPrice({ productId: 1, pricedAt: new Date('2022-04-15T10:00:00.000Z') });
    const price4 = createFakeProductPrice({ productId: 1, pricedAt: new Date('2022-04-02T10:00:00.000Z') });
    const prices = [price1, price2, price3, price4];
    const product = createFakeProduct({ id: 1, prices });
    productRepository.setProducts([product]);

    const result = await sut.perform({ productId: 1, dateFilter: DateRangeFilter.LastMonth });

    expect(result.product.prices.length).toBe(3);
    expect(result.product.prices).toStrictEqual(prices.slice(0, 3));
    expect(result.total).toBe(4);
  });
});

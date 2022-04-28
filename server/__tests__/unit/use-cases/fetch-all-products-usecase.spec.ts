import { FetchAllProductsUseCase } from '@app/core/use-cases/fetch-all-products-usecase copy';
import { Pagination } from '@app/shared/pagination';
import { createFakeProduct } from '@tests/helpers/factories/product';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';

function createSut() {
  const productsRepository = new InMemoryProductsRepository();
  const sut = new FetchAllProductsUseCase(productsRepository);
  return { sut, productsRepository };
}

describe('FetchAllProductsUseCase', () => {
  it('should return the products correctly', async () => {
    const { sut, productsRepository } = createSut();

    const products = Array.from({ length: 10 }).map((_, index) => createFakeProduct({ id: index + 1 }));
    productsRepository.setProducts(products);
    const pagination = Pagination.make({ page: 2, perPage: 2 });
    const result = await sut.perform({ pagination });

    expect(result.products).toHaveLength(2);
    expect(result.products).toStrictEqual(products.slice(2, 4));
    expect(result.total).toBe(10);
  });
});

import { Product } from '@app/core/entities/product';
import { SaveProductUseCase } from '@app/core/use-cases/save-product-usecase';
import { Clock } from '@app/shared/clock';
import { createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';

function createSut() {
  const scrapper = new FakeScrapper();
  const scrapSpy = jest.spyOn(scrapper, 'scrap');
  jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-10-09T10:10:00.000Z'));
  const productsRepository = new InMemoryProductsRepository();
  const sut = new SaveProductUseCase(scrapper, productsRepository);
  return { sut, scrapSpy, productsRepository };
}

describe('SaveProductUseCase', () => {
  it('should save the scrapped product into products repository', async () => {
    const { sut, scrapSpy, productsRepository } = createSut();
    const productSnapshot = createFakeProductSnapshot();
    scrapSpy.mockResolvedValue(productSnapshot);

    const result = await sut.perform({ url: 'http://anyurl.com' });

    const expectedProduct: Product = {
      id: 1,
      name: productSnapshot.name,
      price: productSnapshot.price,
      url: productSnapshot.url,
      prices: [
        {
          id: 1,
          pricedAt: Clock.current(),
          productId: 1,
          value: productSnapshot.price,
        },
      ],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };
    expect(result.product).toMatchObject(expectedProduct);
    expect(productsRepository.products.get(result.product.id)).toMatchObject(expectedProduct);
  });
});

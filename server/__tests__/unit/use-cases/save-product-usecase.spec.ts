import { Product } from '@app/core/entities/product';
import { SaveProductUseCase } from '@app/core/use-cases/save-product-usecase';
import { Clock } from '@app/shared/clock';
import { createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';
import { InMemoryScrappingCache } from '@tests/mocks/InMemoryScrappingCache';

const url = 'http://anyurl.com';

function createSut() {
  const scrapper = new FakeScrapper();
  const productSnapshot = createFakeProductSnapshot();
  scrapper.snapshots.set(url, productSnapshot);
  const scrappingCache = new InMemoryScrappingCache();
  const scrapSpy = jest.spyOn(scrapper, 'scrap');
  jest.spyOn(Clock, 'current').mockReturnValue(new Date('2022-10-09T10:10:00.000Z'));
  const productsRepository = new InMemoryProductsRepository();
  const sut = new SaveProductUseCase(scrapper, scrappingCache, productsRepository);
  return { sut, scrapSpy, productsRepository, scrappingCache, productSnapshot, scrapper };
}

describe('SaveProductUseCase', () => {
  it('should save the scrapped product into products repository', async () => {
    const { sut, productsRepository, productSnapshot } = createSut();

    const result = await sut.perform({ url });

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

  it('should cache the scrapped snapshot', async () => {
    const { sut, scrapper, productSnapshot } = createSut();

    await sut.perform({ url });

    expect(await scrapper.cache.get(url)).toStrictEqual(productSnapshot);
  });

  it('should save product from cache when it is available', async () => {
    const { sut, scrapSpy, productsRepository, scrappingCache } = createSut();
    const productSnapshot = createFakeProductSnapshot();

    scrappingCache.set(url, productSnapshot);
    const result = await sut.perform({ url: url });

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
    expect(scrapSpy).not.toHaveBeenCalled();
    expect(productsRepository.products.get(result.product.id)).toMatchObject(expectedProduct);
  });
});

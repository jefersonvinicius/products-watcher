import { Product, ProductNotFound } from '@app/core/entities/product';
import { CheckProductPriceUseCase } from '@app/core/use-cases/check-product-price-usecase copy';
import { Clock } from '@app/shared/clock';
import { createFakeProduct, createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { createFakeProductPrice } from '@tests/helpers/factories/product-price';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';
import { InMemoryScrappingCache } from '@tests/mocks/InMemoryScrappingCache';

function createSut() {
  const scrapper = new FakeScrapper();
  const productsRepository = new InMemoryProductsRepository();
  const scrappingCache = new InMemoryScrappingCache();
  const sut = new CheckProductPriceUseCase(scrapper, productsRepository, scrappingCache);

  const currentDate = new Date('2022-10-20T10:00:00.000Z');
  const snapshot = createFakeProductSnapshot({ price: 100 });
  const product = createFakeProduct({ price: 150 });
  productsRepository.setProducts([product]);
  const scrapperSpy = jest.spyOn(scrapper, 'scrap').mockResolvedValue(snapshot);
  jest.spyOn(Clock, 'current').mockReturnValue(currentDate);

  return { sut, scrapper, productsRepository, scrapperSpy, product, snapshot, currentDate, scrappingCache };
}

describe('CheckProductPriceUseCase', () => {
  it('should update current product price with snapshot price', async () => {
    const { sut, productsRepository, scrapperSpy, product, snapshot } = createSut();

    const result = await sut.perform({ productId: product.id });

    expect(result.product.id).toBe(product.id);
    expect(result.product.price).toBe(snapshot.price);
    expect(scrapperSpy).toHaveBeenCalledWith(product.url);
    const productSaved = productsRepository.products.get(product.id);
    expect(productSaved?.price).toBe(snapshot.price);
  });

  it('should add product price to product', async () => {
    const { sut, productsRepository, currentDate, product, snapshot } = createSut();

    const result = await sut.perform({ productId: product.id });

    expect(result.product.id).toBe(product.id);
    expect(result.product.prices[0]).toStrictEqual({
      id: 1,
      value: snapshot.price,
      pricedAt: currentDate,
      productId: product.id,
    });
    expect(result.product.prices).toHaveLength(1);
    const productSaved = productsRepository.products.get(product.id);
    expect(productSaved?.prices).toHaveLength(1);
  });

  it('should throw an error if product is not found', async () => {
    const { sut, productsRepository } = createSut();
    productsRepository.clear();

    const promise = sut.perform({ productId: 1 });

    await expect(promise).rejects.toThrowError(new ProductNotFound(1));
  });

  it('should not add product price when scrapped price is the same', async () => {
    const { sut, productsRepository, scrapper } = createSut();
    const snapshot = createFakeProductSnapshot({ price: 100 });
    const product = createFakeProduct({ price: 100 });
    productsRepository.setProducts([product]);
    jest.spyOn(scrapper, 'scrap').mockResolvedValue(snapshot);

    const result = await sut.perform({ productId: product.id });

    expect(result.product.prices).toHaveLength(0);
  });

  it('should cache the scrapped snapshot of the product', async () => {
    const { sut, scrappingCache, product, snapshot } = createSut();

    await sut.perform({ productId: product.id });

    expect(await scrappingCache.get(product.url)).toStrictEqual(snapshot);
  });
});

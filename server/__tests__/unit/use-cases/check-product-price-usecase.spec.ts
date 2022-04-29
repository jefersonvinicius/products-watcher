import { Product } from '@app/core/entities/product';
import { CheckProductPriceUseCase } from '@app/core/use-cases/check-product-price-usecase copy';
import { Clock } from '@app/shared/clock';
import { createFakeProduct, createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { createFakeProductPrice } from '@tests/helpers/factories/product-price';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';

function createSut() {
  const scrapper = new FakeScrapper();
  const productsRepository = new InMemoryProductsRepository();
  const sut = new CheckProductPriceUseCase(scrapper, productsRepository);
  return { sut, scrapper, productsRepository };
}

describe('CheckProductPriceUseCase', () => {
  it('should update current product price with snapshot price', async () => {
    const { sut, scrapper, productsRepository } = createSut();
    const snapshot = createFakeProductSnapshot({ price: 100 });
    const product = createFakeProduct({ price: 150 });
    const scrapperSpy = jest.spyOn(scrapper, 'scrap').mockResolvedValue(snapshot);

    const result = await sut.perform({ product });

    expect(result.product.id).toBe(product.id);
    expect(result.product.price).toBe(snapshot.price);
    expect(scrapperSpy).toHaveBeenCalledWith(product.url);
    const productSaved = productsRepository.products.get(product.id);
    expect(productSaved?.price).toBe(snapshot.price);
  });

  it('should add product price to product', async () => {
    const { sut, scrapper, productsRepository } = createSut();
    const currentDate = new Date('2022-10-20T10:00:00.000Z');
    const snapshot = createFakeProductSnapshot({ price: 100 });
    const product = createFakeProduct({ price: 150 });
    jest.spyOn(Clock, 'current').mockReturnValue(currentDate);
    jest.spyOn(scrapper, 'scrap').mockResolvedValue(snapshot);

    const result = await sut.perform({ product });

    expect(result.product.id).toBe(product.id);
    expect(result.product.prices[0]).toStrictEqual({
      id: 1,
      value: snapshot.price,
      pricedAt: currentDate,
    });
    expect(result.product.prices).toHaveLength(1);
    const productSaved = productsRepository.products.get(product.id);
    expect(productSaved?.prices).toHaveLength(1);
  });
});

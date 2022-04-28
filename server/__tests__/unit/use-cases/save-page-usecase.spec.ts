import { SavePageUseCase } from '@app/core/use-cases/save-page-usecase';
import { createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';

function createSut() {
  const scrapper = new FakeScrapper();
  const scrapSpy = jest.spyOn(scrapper, 'scrap');
  const productsRepository = new InMemoryProductsRepository();
  const sut = new SavePageUseCase(scrapper, productsRepository);
  return { sut, scrapSpy, productsRepository };
}

describe('ScrapPageUseCase', () => {
  it('should save the scrapped product into products repository', async () => {
    const { sut, scrapSpy, productsRepository } = createSut();
    const productSnapshot = createFakeProductSnapshot();
    scrapSpy.mockResolvedValue(productSnapshot);

    const result = await sut.perform({ url: 'http://anyurl.com' });

    const expectedProduct = {
      id: 1,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      ...productSnapshot,
    };
    expect(result.product).toStrictEqual(expectedProduct);
    expect(productsRepository.products.get(result.product.id)).toStrictEqual(expectedProduct);
  });
});

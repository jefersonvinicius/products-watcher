import { ScrapPageUseCase } from '@app/core/use-cases/scrap-page-usecase';
import { createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';

const url = 'http://any.com';

function createSut() {
  const scrapper = new FakeScrapper();
  const productSnapshot = createFakeProductSnapshot();
  scrapper.snapshots.set(url, productSnapshot);
  const sut = new ScrapPageUseCase(scrapper);
  return { sut, scrapper, productSnapshot };
}

describe('ScrapPageUseCase', () => {
  it('should return the product from scrapper', async () => {
    const { sut, productSnapshot } = createSut();

    const result = await sut.perform({ url });

    expect(result.product).toStrictEqual(productSnapshot);
  });

  it('should throw error if scrapper throws', async () => {
    const { sut, scrapper } = createSut();

    jest.spyOn(scrapper, 'scrapAndCache').mockRejectedValue(new Error('Scrapper error'));

    const promise = sut.perform({ url: 'http://anyurl.com' });
    await expect(promise).rejects.toThrowError(new Error('Scrapper error'));
  });

  it('should save on cache the scrapped snapshot', async () => {
    const { sut, scrapper, productSnapshot } = createSut();

    await sut.perform({ url });

    expect(await scrapper.cache.get(url)).toStrictEqual(productSnapshot);
  });
});

import { ProductSnapshot } from '@app/core/entities/product';
import { ScrapPageUseCase } from '@app/core/use-cases/scrap-page-usecase';
import { Scrapper } from '@app/scrappers';
import { createFakeProductSnapshot } from '@tests/helpers/factories/product';

class FakeScrapper implements Scrapper {
  async scrap(url: string): Promise<ProductSnapshot> {
    return {} as ProductSnapshot;
  }
}

function createSut() {
  const scrapper = new FakeScrapper();
  const scrapSpy = jest.spyOn(scrapper, 'scrap');
  const sut = new ScrapPageUseCase(scrapper);
  return { sut, scrapSpy };
}

describe('ScrapPageUseCase', () => {
  it('should return the product from scrapper', async () => {
    const { sut, scrapSpy } = createSut();

    const productSnapshot = createFakeProductSnapshot();
    scrapSpy.mockResolvedValue(productSnapshot);

    const result = await sut.perform({ url: 'http://anyurl.com' });
    expect(result.product).toStrictEqual(productSnapshot);
    expect(scrapSpy).toHaveBeenCalledWith('http://anyurl.com');
  });

  it('should throw error if scrapper throws', async () => {
    const { sut, scrapSpy } = createSut();

    scrapSpy.mockRejectedValue(new Error('Scrapper error'));

    const promise = sut.perform({ url: 'http://anyurl.com' });
    await expect(promise).rejects.toThrowError(new Error('Scrapper error'));
  });
});

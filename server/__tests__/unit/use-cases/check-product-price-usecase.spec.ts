import { AlertOperations } from '@app/core/entities/alert';
import { ProductNotFound } from '@app/core/entities/product';
import { CheckProductPriceUseCase } from '@app/core/use-cases/check-product-price-usecase';
import { INFRA_CONFIG } from '@app/infra/config';
import { Email } from '@app/infra/mailing/email';
import { MailBox, SendAlertParams } from '@app/infra/mailing/mail-box';
import { Clock } from '@app/shared/clock';
import { createFakeAlert } from '@tests/helpers/factories/alerts';
import { createFakeProduct, createFakeProductSnapshot } from '@tests/helpers/factories/product';
import { FakeScrapper } from '@tests/mocks/FakeScrapper';
import { InMemoryAlertsRepository } from '@tests/mocks/InMemoryAlertsRepository';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';
import { InMemoryScrappingCache } from '@tests/mocks/InMemoryScrappingCache';

class InMemoryMailBox implements MailBox {
  emailsSended: Email[] = [];

  async sendAlert(params: SendAlertParams): Promise<void> {
    const { alert, product } = params;
    this.emailsSended.push(
      new Email(
        `Product ${product.id} Alert ${alert.id}`,
        `type: ${alert.alertType} - operation: ${alert.operation} - value: ${alert.value}`,
        INFRA_CONFIG.DEFAULT_EMAIL_TO
      )
    );
  }
}

function createSut() {
  const scrapper = new FakeScrapper();
  const alertsRepository = new InMemoryAlertsRepository();
  const productsRepository = new InMemoryProductsRepository();
  const scrappingCache = new InMemoryScrappingCache();
  const emailBox = new InMemoryMailBox();
  const sut = new CheckProductPriceUseCase(scrapper, productsRepository, alertsRepository, scrappingCache, emailBox);

  const currentDate = new Date('2022-10-20T10:00:00.000Z');
  const snapshot = createFakeProductSnapshot({ price: 100 });
  const product = createFakeProduct({ price: 150 });
  productsRepository.setProducts([product]);
  const scrapperSpy = jest.spyOn(scrapper, 'scrap').mockResolvedValue(snapshot);
  jest.spyOn(Clock, 'current').mockReturnValue(currentDate);

  return {
    sut,
    scrapper,
    productsRepository,
    scrapperSpy,
    product,
    snapshot,
    currentDate,
    scrappingCache,
    emailBox,
    alertsRepository,
  };
}

describe('CheckProductPriceUseCase', () => {
  it('should update current product price with snapshot price', async () => {
    const { sut, productsRepository, scrapperSpy, product, snapshot } = createSut();

    const result = await sut.perform({ productId: product.id! });

    expect(result.product.id).toBe(product.id);
    expect(result.product.price).toBe(snapshot.price);
    expect(scrapperSpy).toHaveBeenCalledWith(product.url);
    const productSaved = productsRepository.products.get(product.id!);
    expect(productSaved?.price).toBe(snapshot.price);
  });

  it('should add product price to product', async () => {
    const { sut, productsRepository, currentDate, product, snapshot } = createSut();

    const result = await sut.perform({ productId: product.id! });

    expect(result.product.id).toBe(product.id);
    expect(result.product.prices![0]).toStrictEqual({
      id: 1,
      value: snapshot.price,
      pricedAt: currentDate,
      productId: product.id,
    });
    expect(result.product.prices).toHaveLength(1);
    const productSaved = productsRepository.products.get(product.id!);
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

    const result = await sut.perform({ productId: product.id! });

    expect(result.product.prices).toHaveLength(0);
  });

  it('should cache the scrapped snapshot of the product', async () => {
    const { sut, scrappingCache, product, snapshot } = createSut();

    await sut.perform({ productId: product.id! });

    expect(await scrappingCache.get(product.url)).toStrictEqual(snapshot);
  });

  it('should send alerts when they are alertable', async () => {
    const { sut, productsRepository, emailBox } = createSut();
    const alert1 = createFakeAlert({ operation: AlertOperations.LessThan, value: 150, alertSended: false });
    const alert2 = createFakeAlert({ operation: AlertOperations.LessThan, value: 120, alertSended: false });
    const alert3 = createFakeAlert({ operation: AlertOperations.Equals, value: 120, alertSended: false });
    const product = createFakeProduct({ id: 1, price: 200, alerts: [alert1, alert2, alert3] });
    productsRepository.setProducts([product]);

    await sut.perform({ productId: product.id! });

    expect(emailBox.emailsSended.length).toBe(2);
    expect(emailBox.emailsSended[0].subject).toBe(`Product ${product.id} Alert ${alert1.id}`);
    expect(emailBox.emailsSended[1].subject).toBe(`Product ${product.id} Alert ${alert2.id}`);
  });

  it('should update the alert status after send it', async () => {
    const { sut, productsRepository, alertsRepository } = createSut();
    const alert1 = createFakeAlert({ operation: AlertOperations.LessThan, value: 150, alertSended: false });
    const product = createFakeProduct({ id: 1, price: 200, alerts: [alert1] });
    productsRepository.setProducts([product]);

    await sut.perform({ productId: product.id! });

    const alert = product.alerts![0];
    expect(alert.alertSended).toBe(true);
    expect(alertsRepository.alerts.get(alert.id!)?.alertSended).toBe(true);
  });
});

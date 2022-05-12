import { AlertOperations, AlertTypes } from '@app/core/entities/alert';
import { ProductNotFound } from '@app/core/entities/product';
import { CreateAlertUseCase } from '@app/core/use-cases/create-alert-usecase';
import { createFakeProduct } from '@tests/helpers/factories/product';
import { InMemoryAlertsRepository } from '@tests/mocks/InMemoryAlertsRepository';
import { InMemoryProductsRepository } from '@tests/mocks/InMemoryProductsRepository';

function createSut() {
  const alertsRepository = new InMemoryAlertsRepository();
  const productsRepository = new InMemoryProductsRepository();
  const product = createFakeProduct({ id: 1 });
  productsRepository.setProducts([product]);
  const useCaseParams = { operation: AlertOperations.GreaterThan, productId: 1, value: 100 };
  const sut = new CreateAlertUseCase(alertsRepository, productsRepository);
  return { sut, alertsRepository, useCaseParams, productsRepository };
}

describe('CreateAlertUseCase', () => {
  it('should create the alert', async () => {
    const { sut, useCaseParams } = createSut();

    const result = await sut.perform(useCaseParams);

    expect(result.alert).toMatchObject({
      id: 1,
      operation: AlertOperations.GreaterThan,
      productId: 1,
      value: 100,
      _alertSended: false,
      alertType: AlertTypes.Email,
    });
  });

  it('should save the created alert into repository', async () => {
    const { sut, useCaseParams, alertsRepository } = createSut();

    const result = await sut.perform(useCaseParams);

    expect(alertsRepository.alerts.get(1)).toStrictEqual(result.alert);
    expect(result.alert.id).toBe(1);
  });

  it('should throw error if product is not found', async () => {
    const { sut, useCaseParams, productsRepository } = createSut();
    productsRepository.clear();

    const promise = sut.perform(useCaseParams);

    await expect(promise).rejects.toThrowError(new ProductNotFound(useCaseParams.productId));
  });
});

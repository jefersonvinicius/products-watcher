import { AlertOperations, AlertTypes } from '@app/core/entities/alert';
import { CreateAlertUseCase } from '@app/core/use-cases/create-alert-usecase';
import { InMemoryAlertsRepository } from '@tests/mocks/InMemoryAlertsRepository';

function createSut() {
  const alertsRepository = new InMemoryAlertsRepository();
  const useCaseParams = { operation: AlertOperations.GreaterThan, productId: 1, value: 100 };
  const sut = new CreateAlertUseCase(alertsRepository);
  return { sut, alertsRepository, useCaseParams };
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
      alertType: AlertTypes.Email,
      alertSended: false,
    });
  });

  it('should save the created alert into repository', async () => {
    const { sut, useCaseParams, alertsRepository } = createSut();

    const result = await sut.perform(useCaseParams);

    expect(alertsRepository.alerts.get(1)).toStrictEqual(result.alert);
    expect(result.alert.id).toBe(1);
  });
});

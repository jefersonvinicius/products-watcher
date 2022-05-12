import { CreateAlertUseCase } from '@app/core/use-cases/create-alert-usecase';
import { makeAlertsRepository } from '@app/factories/repositories/alerts';
import { makeProductsRepository } from '@app/factories/repositories/products';

export function makeCreateAlertUseCase() {
  return new CreateAlertUseCase(makeAlertsRepository(), makeProductsRepository());
}

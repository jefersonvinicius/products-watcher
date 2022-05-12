import { Alert } from '@app/core/entities/alert';
import { ProductNotFound } from '@app/core/entities/product';
import { AlertSavingData, AlertsRepository } from '@app/core/repositories/alerts';
import { ProductsRepository } from '@app/core/repositories/products';
import { UseCase } from '@app/core/use-cases';

type CreateAlertParams = Omit<AlertSavingData, 'alertSended' | 'alertType'>;

type CreateAlertResult = {
  alert: Alert;
};

export class CreateAlertUseCase implements UseCase<CreateAlertParams, CreateAlertResult> {
  constructor(private alertsRepository: AlertsRepository, private productsRepository: ProductsRepository) {}

  async perform(params: CreateAlertParams): Promise<CreateAlertResult> {
    const product = await this.productsRepository.findById(params.productId);
    if (!product) throw new ProductNotFound(params.productId);
    const alert = Alert.makeEmailAlert({
      operation: params.operation,
      productId: params.productId,
      value: params.value,
    });
    const alertSaved = await this.alertsRepository.save(alert);
    return { alert: alertSaved };
  }
}

import { Alert } from '@app/core/entities/alert';
import { AlertSavingData, AlertsRepository } from '@app/core/repositories/alerts';
import { UseCase } from '@app/core/use-cases';

type CreateAlertParams = Omit<AlertSavingData, 'alertSended' | 'alertType'>;

type CreateAlertResult = {
  alert: Alert;
};

export class CreateAlertUseCase implements UseCase<CreateAlertParams, CreateAlertResult> {
  constructor(private alertsRepository: AlertsRepository) {}

  async perform(params: CreateAlertParams): Promise<CreateAlertResult> {
    const alert = Alert.makeEmailAlert({
      operation: params.operation,
      productId: params.productId,
      value: params.value,
    });
    const alertSaved = await this.alertsRepository.save(alert);
    return { alert: alertSaved };
  }
}

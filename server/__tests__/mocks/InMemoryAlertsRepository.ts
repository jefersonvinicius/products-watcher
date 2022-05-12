import { Alert } from '@app/core/entities/alert';
import { AlertsRepository, AlertSavingData } from '@app/core/repositories/alerts';

export class InMemoryAlertsRepository implements AlertsRepository {
  private currentId = 1;
  alerts = new Map<number, Alert>();

  async save(data: Alert): Promise<Alert> {
    const alert = Alert.fromPlainObject({
      ...data.toJSON(),
      id: data.id ?? this.currentId,
    });
    this.alerts.set(alert.id!, alert);
    this.currentId++;
    return alert;
  }
}

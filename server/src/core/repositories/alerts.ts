import { Alert, AlertEntityAttrs } from '@app/core/entities/alert';

export type AlertSavingData = Omit<AlertEntityAttrs, 'id'>;

export interface AlertsRepository {
  save(data: Alert): Promise<Alert>;
}

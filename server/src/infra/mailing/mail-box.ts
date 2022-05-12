import { Alert } from '@app/core/entities/alert';
import { Product } from '@app/core/entities/product';

export type SendAlertParams = {
  alert: Alert;
  product: Product;
};

export interface MailBox {
  sendAlert(params: SendAlertParams): Promise<void>;
}

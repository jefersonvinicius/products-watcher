export enum AlertOperations {
  Equals = 'equals',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
}

export enum AlertTypes {
  Email = 'email',
}

interface AlertEntityAttrs {
  id: number;
  operation: AlertOperations;
  value: number;
  alertType: AlertTypes;
  alertSended: boolean;
  productId: number;
}

type EmailAlertParams = Omit<AlertEntityAttrs, 'alertType'>;

export class Alert implements AlertEntityAttrs {
  private constructor(
    readonly id: number,
    readonly operation: AlertOperations,
    readonly value: number,
    readonly alertType: AlertTypes,
    readonly alertSended: boolean,
    readonly productId: number
  ) {}

  static makeEmailAlert(params: EmailAlertParams) {
    return new Alert(params.id, params.operation, params.value, AlertTypes.Email, true, params.productId);
  }

  static fromPlainObject(params: AlertEntityAttrs) {
    return new Alert(params.id, params.operation, params.value, params.alertType, params.alertSended, params.productId);
  }

  isAlertable(params: { price: number }) {
    if (this.alertSended) return false;

    const { price } = params;
    switch (this.operation) {
      case AlertOperations.GreaterThan:
        return price > this.value;
      case AlertOperations.Equals:
        return price === this.value;
      case AlertOperations.LessThan:
        return price < this.value;
      default:
        return false;
    }
  }
}

export enum AlertOperations {
  Equals = 'equals',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
}

export enum AlertTypes {
  Email = 'email',
}

export interface AlertEntityAttrs {
  id?: number | undefined;
  operation: AlertOperations;
  value: number;
  alertType: AlertTypes;
  alertSended: boolean;
  productId: number;
}

export class InvalidAlertOperation extends Error {
  constructor(operation: string) {
    super(`The operations available are ${Object.values(AlertOperations).join(', ')}. But got ${operation}`);
  }
}

export class InvalidAlertType extends Error {
  constructor(alertType: string) {
    super(`The alert types available are ${Object.values(AlertTypes).join(', ')}. But got ${alertType}`);
  }
}

type EmailAlertParams = Omit<AlertEntityAttrs, 'alertType' | 'alertSended' | 'id'>;

export class Alert implements AlertEntityAttrs {
  private constructor(
    readonly id: number | undefined,
    readonly operation: AlertOperations,
    readonly value: number,
    readonly alertType: AlertTypes,
    // private _alertSended: boolean,
    private _alertSended: boolean,
    readonly productId: number
  ) {
    this.validate();
  }

  static makeEmailAlert(params: EmailAlertParams) {
    return new Alert(undefined, params.operation, params.value, AlertTypes.Email, false, params.productId);
  }

  static fromPlainObject(params: AlertEntityAttrs) {
    return new Alert(params.id, params.operation, params.value, params.alertType, params.alertSended, params.productId);
  }

  private validate() {
    if (!Object.values(AlertOperations).includes(this.operation)) throw new InvalidAlertOperation(this.operation);
    if (!Object.values(AlertTypes).includes(this.alertType)) throw new InvalidAlertType(this.alertType);
  }

  changeToSended() {
    this._alertSended = true;
  }

  get alertSended() {
    return this._alertSended;
  }

  toJSON() {
    return { ...this, alertSended: this.alertSended };
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

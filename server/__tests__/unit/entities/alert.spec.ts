import { Alert, AlertOperations, AlertTypes, InvalidAlertOperation, InvalidAlertType } from '@app/core/entities/alert';
import { createFakeAlert } from '@tests/helpers/factories/alerts';

describe('Alert', () => {
  it('should return correct boolean value when operation is greater than', () => {
    const alert = createFakeAlert({ operation: AlertOperations.GreaterThan, value: 100, alertSended: false });

    expect(alert.isAlertable({ price: 99 })).toBe(false);
    expect(alert.isAlertable({ price: 100 })).toBe(false);
    expect(alert.isAlertable({ price: 101 })).toBe(true);
  });

  it('should return correct boolean value when operation is equals', () => {
    const alert = createFakeAlert({ operation: AlertOperations.Equals, value: 100, alertSended: false });

    expect(alert.isAlertable({ price: 99 })).toBe(false);
    expect(alert.isAlertable({ price: 100 })).toBe(true);
    expect(alert.isAlertable({ price: 101 })).toBe(false);
  });

  it('should return correct boolean value when operation is less than', () => {
    const alert = createFakeAlert({ operation: AlertOperations.LessThan, value: 100, alertSended: false });

    expect(alert.isAlertable({ price: 99 })).toBe(true);
    expect(alert.isAlertable({ price: 100 })).toBe(false);
    expect(alert.isAlertable({ price: 101 })).toBe(false);
  });

  it('should return false when alert is already sended', () => {
    const alert = createFakeAlert({ operation: AlertOperations.GreaterThan, value: 100, alertSended: true });

    expect(alert.isAlertable({ price: 120 })).toBe(false);
  });

  describe('validation', () => {
    let validAlertData = {
      id: 1,
      alertSended: false,
      value: 100,
      productId: 1,
      alertType: AlertTypes.Email,
      operation: AlertOperations.GreaterThan,
    };
    it('should throws if invalid operation is provided', () => {
      expect(() => {
        Alert.fromPlainObject({ ...validAlertData, operation: 'any' as AlertOperations });
      }).toThrowError(new InvalidAlertOperation('any'));
    });

    it('should throws if invalid alert type is provided', () => {
      expect(() => {
        Alert.fromPlainObject({ ...validAlertData, alertType: 'any' as AlertTypes });
      }).toThrowError(new InvalidAlertType('any'));
    });
  });
});

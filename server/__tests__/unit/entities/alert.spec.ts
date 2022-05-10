import { AlertOperations } from '@app/core/entities/alert';
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

  it('should return false when operation is not recognized', () => {
    const alert = createFakeAlert({ operation: 'any' as AlertOperations, value: 100, alertSended: false });

    expect(alert.isAlertable({ price: 99 })).toBe(false);
    expect(alert.isAlertable({ price: 100 })).toBe(false);
    expect(alert.isAlertable({ price: 101 })).toBe(false);
  });

  it('should return false when alert is already sended', () => {
    const alert = createFakeAlert({ operation: AlertOperations.GreaterThan, value: 100, alertSended: true });

    expect(alert.isAlertable({ price: 120 })).toBe(false);
  });
});

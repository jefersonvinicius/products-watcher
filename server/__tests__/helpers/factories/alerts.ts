import { Alert, AlertOperations, AlertTypes } from '@app/core/entities/alert';
import faker from '@faker-js/faker';

export function createFakeAlert(override: Partial<Alert> = {}) {
  return Alert.fromPlainObject({
    id: faker.datatype.number(),
    alertSended: faker.random.arrayElement([true, false]),
    alertType: faker.random.arrayElement(Object.values(AlertTypes)),
    operation: faker.random.arrayElement(Object.values(AlertOperations)),
    productId: faker.datatype.number(),
    value: faker.datatype.number(),
    ...override,
  });
}

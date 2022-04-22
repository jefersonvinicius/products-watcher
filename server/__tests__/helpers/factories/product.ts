import { ProductSnapshot } from '@app/core/entities/product';
import faker from '@faker-js/faker';

export function createFakeProductSnapshot(override: Partial<ProductSnapshot> = {}): ProductSnapshot {
  return {
    name: faker.commerce.productName(),
    price: faker.datatype.number({ min: 10 }),
    url: faker.internet.url(),
    ...override,
  };
}

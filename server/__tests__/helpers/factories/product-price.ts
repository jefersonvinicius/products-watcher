import { ProductPrice } from '@app/core/entities/product-price';
import faker from '@faker-js/faker';

export function createFakeProductPrice(override: Partial<ProductPrice> = {}): ProductPrice {
  return {
    id: faker.datatype.number(),
    value: faker.datatype.number(),
    pricedAt: new Date(),
    productId: faker.datatype.number(),
    ...override,
  };
}

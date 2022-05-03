import { ProductPrice } from '@app/core/entities/product-price';

export interface ProductSnapshot {
  url: string;
  name: string;
  price: number;
}

type ProductPropertiesWithoutDefaults = Omit<Product, 'createdAt' | 'updatedAt'>;

export class Product implements ProductSnapshot {
  prices: ProductPrice[] = [];

  private constructor(
    readonly id: number,
    readonly name: string,
    readonly url: string,
    readonly price: number,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {}

  static withDefaults(data: ProductPropertiesWithoutDefaults) {
    return new Product(data.id, data.name, data.url, data.price, new Date(), new Date());
  }
}

export class ProductNotFound extends Error {
  constructor(productId: number) {
    super(`The product with id ${productId} was not found`);
  }
}

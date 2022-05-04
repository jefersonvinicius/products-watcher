import { ProductPrice } from '@app/core/entities/product-price';

export interface ProductSnapshot {
  url: string;
  name: string;
  price: number;
}

export interface ProductEntityAttrs extends ProductSnapshot {
  id: number;

  createdAt: Date;
  updatedAt: Date;
  prices: ProductPrice[];
}

type ProductPropertiesWithoutDefaults = Omit<Product, 'createdAt' | 'updatedAt'>;

export class Product implements ProductEntityAttrs {
  private constructor(
    readonly id: number,
    readonly name: string,
    readonly url: string,
    readonly price: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly prices: ProductPrice[] = []
  ) {}

  static withDefaults(data: ProductPropertiesWithoutDefaults) {
    return new Product(data.id, data.name, data.url, data.price, new Date(), new Date(), data.prices);
  }

  static fromPlainObject(data: Required<Product>) {
    return new Product(data.id, data.name, data.url, data.price, data.createdAt, data.updatedAt, data.prices);
  }
}

export class ProductNotFound extends Error {
  constructor(productId: number) {
    super(`The product with id ${productId} was not found`);
  }
}

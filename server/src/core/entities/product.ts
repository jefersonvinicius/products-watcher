import { ProductPrice } from '@app/core/entities/product-price';

export interface ProductSnapshot {
  url: string;
  name: string;
  price: number;
}

export interface Product extends ProductSnapshot {
  id: number;
  prices: ProductPrice[];
  createdAt: Date;
  updatedAt: Date;
}

export class ProductNotFound extends Error {
  constructor(productId: number) {
    super(`The product with id ${productId} was not found`);
  }
}

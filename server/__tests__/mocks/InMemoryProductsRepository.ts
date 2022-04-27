import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';

export class InMemoryProductsRepository implements ProductsRepository {
  private currentId = 1;
  products = new Map<number, Product>();

  async save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const productToSave: Product = {
      id: this.currentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...product,
    };
    this.products.set(productToSave.id, productToSave);
    this.currentId++;

    return productToSave;
  }
}

import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { Pagination } from '@app/shared/pagination';

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

  async findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }> {
    const { pagination } = params;
    const start = (pagination.page - 1) * pagination.perPage;
    const end = start + pagination.perPage;
    const productsList = Array.from(this.products.values()).slice(start, end);
    return { products: productsList, total: this.products.size };
  }

  setProducts(products: Product[]) {
    products.forEach((product) => this.products.set(product.id, product));
    this.currentId += products.length;
  }
}

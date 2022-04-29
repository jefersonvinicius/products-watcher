import { Product, ProductSnapshot } from '@app/core/entities/product';
import { ProductPrice } from '@app/core/entities/product-price';
import { ProductsRepository } from '@app/core/repositories/products';
import { Clock } from '@app/shared/clock';
import { Pagination } from '@app/shared/pagination';

export class InMemoryProductsRepository implements ProductsRepository {
  private currentId = 1;
  private currentPriceId = 1;
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

  async updateWithSnapshotData(product: Product, snapshot: ProductSnapshot): Promise<Product> {
    const clone: Product = JSON.parse(JSON.stringify(product));
    const productPrice: ProductPrice = { id: this.currentPriceId, value: snapshot.price, pricedAt: Clock.current() };
    this.currentPriceId++;
    clone.price = snapshot.price;
    clone.prices.push(productPrice);
    this.products.set(clone.id, clone);
    return clone;
  }

  setProducts(products: Product[]) {
    products.forEach((product) => this.products.set(product.id, product));
    this.currentId += products.length;
  }
}

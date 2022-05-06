import { Product, ProductSnapshot } from '@app/core/entities/product';
import { ProductPrice } from '@app/core/entities/product-price';
import {
  FindByIdWithPricesFilteredParams,
  FindByIdWithPricesFilteredResult,
  ProductsRepository,
  UpdateWithSnapshotParams,
} from '@app/core/repositories/products';
import { Clock } from '@app/shared/clock';
import { Pagination } from '@app/shared/pagination';

export class InMemoryProductsRepository implements ProductsRepository {
  private currentId = 1;
  private currentPriceId = 1;
  products = new Map<number, Product>();

  async save(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const productToSave = Product.withDefaults({
      id: this.currentId,
      ...product,
    });
    this.products.set(productToSave.id, productToSave);
    this.currentId++;

    return productToSave;
  }

  async findById(productId: number): Promise<Product | null> {
    return this.products.get(productId) ?? null;
  }

  async findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }> {
    const { pagination } = params;
    const start = (pagination.page - 1) * pagination.perPage;
    const end = start + pagination.perPage;
    const productsList = Array.from(this.products.values()).slice(start, end);
    return { products: productsList, total: this.products.size };
  }

  async addProductPriceFromSnapshot({ productId, snapshot }: UpdateWithSnapshotParams): Promise<Product> {
    const product = this.products.get(productId)!;
    const productPrice: ProductPrice = {
      id: this.currentPriceId,
      value: snapshot.price,
      pricedAt: Clock.current(),
      productId: product.id,
    };
    this.currentPriceId++;
    const newProduct = Product.withDefaults({ ...product, price: snapshot.price });
    newProduct.prices.push(productPrice);
    this.products.set(product.id, newProduct);
    return newProduct;
  }

  setProducts(products: Product[]) {
    products.forEach((product) => this.products.set(product.id, product));
    this.currentId += products.length;
  }

  async findByIdWithPricesFiltered(
    params: FindByIdWithPricesFilteredParams
  ): Promise<FindByIdWithPricesFilteredResult> {
    const product = this.products.get(params.productId)!;
    const total = product.prices.length;
    const filtered = product?.prices.filter((price) => params.dateRange.within(price.pricedAt));
    return { product: Product.fromPlainObject({ ...product, prices: filtered }), productPricesTotal: total };
  }

  clear() {
    Array.from(this.products.keys()).forEach((key) => this.products.delete(key));
  }
}

import { Product } from '@app/core/entities/product';
import {
  FindByIdWithPricesFilteredParams,
  FindByIdWithPricesFilteredResult,
  ProductsRepository,
  UpdateWithSnapshotParams,
} from '@app/core/repositories/products';
import { ProductORMEntity } from '@app/infra/database/typeorm/entities/product';
import { ProductPriceORMEntity } from '@app/infra/database/typeorm/entities/product-price';
import { Clock } from '@app/shared/clock';
import { Pagination } from '@app/shared/pagination';
import { Between, DataSource, Repository } from 'typeorm';

export class ProductsRepositoryTypeORM implements ProductsRepository {
  private productPricesRepository: Repository<ProductPriceORMEntity>;
  private productsRepository: Repository<ProductORMEntity>;

  constructor(private dataSource: DataSource) {
    this.productPricesRepository = this.dataSource.getRepository(ProductPriceORMEntity);
    this.productsRepository = this.dataSource.getRepository(ProductORMEntity);
  }

  async save(data: Product): Promise<Product> {
    const typeOrmProduct = this.productsRepository.create({ ...data, alerts: undefined });
    const dbProduct = await this.productsRepository.save(typeOrmProduct);
    const price = await this.productPricesRepository.save({
      pricedAt: Clock.current(),
      productId: dbProduct.id,
      value: data.price,
    });
    const priceSaved = await this.productPricesRepository.findOneBy({ id: price.id });
    return Product.fromPlainObject({ ...dbProduct, prices: [priceSaved!.toEntity()], alerts: undefined });
  }

  async findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }> {
    const { pagination } = params;
    const [rows, total] = await this.productsRepository.findAndCount({ ...pagination.toTypeORM() });

    return { products: rows.map((r) => r.toEntity()), total };
  }

  async findById(productId: number): Promise<Product | null> {
    const product = await this.productsRepository.findOneBy({ id: productId });
    return product?.toEntity() ?? null;
  }

  async findByIdWithAlerts(productId: number): Promise<Product | null> {
    const product = await this.productsRepository.findOne({ where: { id: productId }, relations: { alerts: true } });
    return product?.toEntity() ?? null;
  }

  async addProductPriceFromSnapshot(params: UpdateWithSnapshotParams): Promise<Product> {
    const product = (await this.productsRepository.findOne({
      where: { id: params.productId },
    }))!;
    await this.productPricesRepository.save({
      pricedAt: Clock.current(),
      value: params.snapshot.price,
      product: { id: product.id },
    });
    product.price = params.snapshot.price;
    await this.productsRepository.save(product);
    const withRelations = await this.productsRepository.findOne({
      where: { id: params.productId },
      relations: { prices: true },
    });
    return withRelations!.toEntity();
  }

  async findByIdWithPricesFiltered(
    params: FindByIdWithPricesFilteredParams
  ): Promise<FindByIdWithPricesFilteredResult> {
    const { dateRange, productId } = params;
    const product = await this.findById(productId);
    if (!product) return { product: null, productPricesTotal: 0 };

    const [prices, total] = await this.productPricesRepository.findAndCount({
      where: {
        productId: productId,
        pricedAt: Between(dateRange.startAt, dateRange.endAt),
      },
    });
    const pricesEntities = prices.map((price) => price.toEntity());
    const productEntity = Product.fromPlainObject({ ...product!, prices: pricesEntities });
    return { product: productEntity, productPricesTotal: total };
  }
}

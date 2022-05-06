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

  async save(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const dbProduct = await this.productsRepository.save({ ...data });
    return {
      ...dbProduct,
    };
  }

  async findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }> {
    const { pagination } = params;
    const [rows, total] = await this.productsRepository.findAndCount({ ...pagination.toTypeORM() });

    return { products: rows, total };
  }

  async findById(productId: number): Promise<Product | null> {
    const product = await this.productsRepository.findOneBy({ id: productId });
    return product;
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
    });
    return withRelations!.toEntity();
  }

  async findByIdWithPricesFiltered(
    params: FindByIdWithPricesFilteredParams
  ): Promise<FindByIdWithPricesFilteredResult> {
    const { dateRange, productId } = params;
    const [prices, total] = await this.productPricesRepository.findAndCount({
      where: {
        productId: productId,
        pricedAt: Between(dateRange.startAt, dateRange.endAt),
      },
    });
    const pricesEntities = prices.map((price) => price.toEntity());
    const product = await this.findById(productId)!;
    const productEntity = Product.fromPlainObject({ ...product!, prices: pricesEntities });

    return { product: productEntity, productPricesTotal: total };
  }
}

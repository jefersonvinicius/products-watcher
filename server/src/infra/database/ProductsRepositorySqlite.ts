import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { productSchema } from '@app/infra/database/typeorm/schemas/ProductSchema';
import { Pagination } from '@app/shared/pagination';
import { DataSource, Repository } from 'typeorm';

export class ProductsRepositorySqlite implements ProductsRepository {
  private productsRepository: Repository<Product>;

  constructor(private dataSource: DataSource) {
    this.productsRepository = this.dataSource.getRepository(productSchema);
  }

  async save(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const dbProduct = await this.productsRepository.save({ ...data });
    return {
      ...dbProduct,
    };
  }

  async findAll(params: { pagination: Pagination }): Promise<{ total: number; products: Product[] }> {
    const { pagination } = params;
    const [rows, total] = await this.productsRepository.findAndCount({
      ...pagination.toTypeORM(),
    });

    return { products: rows, total };
  }
}

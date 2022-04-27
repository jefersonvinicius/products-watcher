import { Product } from '@app/core/entities/product';
import { ProductsRepository } from '@app/core/repositories/products';
import { productSchema } from '@app/infra/database/typeorm/schemas/ProductSchema';
import { DataSource } from 'typeorm';

export class ProductsRepositorySqlite implements ProductsRepository {
  constructor(private dataSource: DataSource) {}

  async save(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const productsRepository = this.dataSource.getRepository(productSchema);
    const dbProduct = await productsRepository.save({ ...data });
    return {
      ...dbProduct,
    };
  }
}

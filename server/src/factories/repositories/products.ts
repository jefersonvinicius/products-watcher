import { ProductsRepositoryTypeORM } from '@app/infra/database/products-repository-type-orm';
import { dataSource } from '@app/infra/database/typeorm/datasource';

export function makeProductsRepository() {
  return new ProductsRepositoryTypeORM(dataSource);
}

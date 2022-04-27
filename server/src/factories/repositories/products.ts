import { ProductsRepositorySqlite } from '@app/infra/database/ProductsRepositorySqlite';
import { dataSource } from '@app/infra/database/typeorm/datasource';

export function makeProductsRepository() {
  return new ProductsRepositorySqlite(dataSource);
}

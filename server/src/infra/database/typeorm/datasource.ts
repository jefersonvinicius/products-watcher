import { AlertORMEntity } from '@app/infra/database/typeorm/entities/alert';
import { ProductORMEntity } from '@app/infra/database/typeorm/entities/product';
import { ProductPriceORMEntity } from '@app/infra/database/typeorm/entities/product-price';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [ProductORMEntity, ProductPriceORMEntity, AlertORMEntity],
  synchronize: true,
});

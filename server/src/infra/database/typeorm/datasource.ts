import { productSchema } from '@app/infra/database/typeorm/schemas/ProductSchema';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [productSchema],
  synchronize: true,
});

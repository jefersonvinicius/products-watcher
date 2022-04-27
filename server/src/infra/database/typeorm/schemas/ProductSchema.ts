import { Product } from '@app/core/entities/product';
import { EntitySchema } from 'typeorm';

export const productSchema = new EntitySchema<Product>({
  name: 'product',
  tableName: 'products',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      nullable: false,
    },
    url: {
      type: String,
      nullable: false,
    },
    price: {
      type: Number,
      nullable: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'datetime',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'datetime',
      updateDate: true,
    },
  },
});

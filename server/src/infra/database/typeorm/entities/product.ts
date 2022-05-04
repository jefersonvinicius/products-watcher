import { Product } from '@app/core/entities/product';
import { ProductPriceORMEntity } from '@app/infra/database/typeorm/entities/product-price';
import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySchema,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductORMEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: false })
  url!: string;

  @Column()
  price!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ProductPriceORMEntity, (productPrice) => productPrice.product)
  prices!: ProductPriceORMEntity[];

  toEntity(): Product {
    return Product.fromPlainObject({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      price: this.price,
      prices: this.prices,
      url: this.url,
    });
  }
}

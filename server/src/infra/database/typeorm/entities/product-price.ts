import { ProductORMEntity } from '@app/infra/database/typeorm/entities/product';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'product_prices' })
export class ProductPriceORMEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, name: 'priced_at' })
  pricedAt!: Date;

  @Column()
  value!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => ProductORMEntity, (product) => product.prices)
  product!: ProductORMEntity;
}

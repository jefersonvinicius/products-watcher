import { ProductPrice } from '@app/core/entities/product-price';
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => ProductORMEntity, (product) => product.prices)
  product!: ProductORMEntity;

  @Column({ name: 'product_id' })
  productId!: number;

  toEntity(): ProductPrice {
    return {
      id: this.id,
      pricedAt: this.pricedAt,
      productId: this.productId,
      value: this.value,
    };
  }
}

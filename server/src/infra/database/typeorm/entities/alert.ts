import { Alert, AlertOperations, AlertTypes } from '@app/core/entities/alert';
import { ProductORMEntity } from '@app/infra/database/typeorm/entities/product';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'alerts' })
export class AlertORMEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  operation!: string;

  @Column()
  value!: number;

  @Column({ name: 'alert_sended' })
  alertSended!: boolean;

  @Column({ name: 'alert_type', length: 50 })
  alertType!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => ProductORMEntity, (product) => product.prices)
  @JoinColumn({ name: 'product_id' })
  product!: ProductORMEntity;

  @Column({ name: 'product_id' })
  productId!: number;

  toEntity(): Alert {
    return Alert.fromPlainObject({
      id: this.id,
      alertSended: this.alertSended,
      alertType: this.alertType as AlertTypes,
      operation: this.operation as AlertOperations,
      productId: this.productId,
      value: this.value,
    });
  }
}

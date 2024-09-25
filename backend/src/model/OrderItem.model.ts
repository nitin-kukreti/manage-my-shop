import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderModel } from './Order.model';
import { ProductModel } from './Product.model';

@Entity({ name: 'OrderItem' })
export class OrderItemModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderModel, (item) => item.orderItem)
  order: OrderModel;

  @ManyToOne(() => ProductModel, (item) => item.orderItems)
  product: ProductModel;

  @Column()
  quantity: number;
}

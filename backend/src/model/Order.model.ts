import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemModel } from './OrderItem.model';
import { ShopModel } from './Shop.model';

@Entity({ name: 'Order' })
export class OrderModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'phone_no' })
  phoneNo: string;

  @Column({
    type: 'enum',
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo',
  })
  orderStatus: 'todo' | 'inprogress' | 'done';

  @OneToMany(() => OrderItemModel, (item) => item.order)
  orderItem: OrderItemModel[];

  @ManyToOne(() => ShopModel, (item) => item.orders)
  shop: ShopModel;
}

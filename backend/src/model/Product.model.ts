import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ShopModel } from './Shop.model';
import { InventoryModel } from './Inventory.model';
import { OrderItemModel } from './OrderItem.model';

@Entity({ name: 'Product' })
export class ProductModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column({ default: 0 })
  availableQuantity: number;

  @ManyToOne(() => ShopModel, (shop) => shop.products, { onDelete: 'CASCADE' })
  shop: ShopModel;

  @OneToMany(() => InventoryModel, (inventory) => inventory.product)
  inventory: InventoryModel[];

  @OneToMany(() => OrderItemModel, (item) => item.product)
  orderItems: OrderItemModel[];

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

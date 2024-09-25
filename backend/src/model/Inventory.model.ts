import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductModel } from './Product.model';
import { WareHouseModel } from './WareHouse.model';

@Entity({ name: 'Inventory' })
export class InventoryModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @ManyToOne(() => ProductModel, (product) => product.inventory, {
    onDelete: 'CASCADE',
  })
  product: ProductModel;

  @ManyToOne(() => WareHouseModel, (item) => item.inventory)
  wareHouse: WareHouseModel;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

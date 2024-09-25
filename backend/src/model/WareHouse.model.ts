import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ShopModel } from './Shop.model';
import { InventoryModel } from './Inventory.model';

@Entity({ name: 'ware_house' })
@Unique(['name'])
export class WareHouseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @ManyToOne(() => ShopModel, (item) => item.wareHouses)
  shop: ShopModel;

  @OneToMany(() => InventoryModel, (item) => item.wareHouse)
  inventory: InventoryModel[];
}

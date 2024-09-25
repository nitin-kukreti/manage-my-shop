import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ShopUserRoleModel } from './UserRole.model';
import { ProductModel } from './Product.model';
import { OrderModel } from './Order.model';
import { WareHouseModel } from './WareHouse.model';

@Entity({ name: 'Shop' })
@Unique(['name'])
export class ShopModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ShopUserRoleModel, (shopRoleModel) => shopRoleModel.shop)
  shopUserRoles: ShopUserRoleModel[];

  @OneToMany(() => ProductModel, (product) => product.shop)
  products: ProductModel[];

  @OneToMany(() => OrderModel, (order) => order.shop)
  orders: OrderModel[];

  @OneToMany(() => WareHouseModel, (wareHouse) => wareHouse.shop)
  wareHouses: WareHouseModel[];

  @DeleteDateColumn()
  deletedAt: Date;
}

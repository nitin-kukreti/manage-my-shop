import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { UserModel } from './User.model';
import { RoleModel } from './Role.model';
import { ShopModel } from './Shop.model';

@Entity({ name: 'UserRole' })
@Unique(['user', 'role', 'shop'])
@Index('user_role_userid', ['user'])
@Index('user_role_shopid', ['shop'])
export class ShopUserRoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShopModel, (shop) => shop.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  shop: ShopModel | null;

  @ManyToOne(() => UserModel, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserModel;

  @ManyToOne(() => RoleModel, (role) => role.id, { onDelete: 'CASCADE' })
  role: RoleModel;

  @DeleteDateColumn()
  deletedAt: Date;
}

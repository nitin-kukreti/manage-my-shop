import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ShopUserRoleModel } from './UserRole.model';

@Entity({ name: 'users' })
@Index('unique_email_index', ['email'], { unique: true })
export class UserModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 256, name: 'email' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: ['unverified', 'active', 'inactive'],
    default: 'unverified',
  })
  userStatus: 'unverified' | 'active' | 'inactive';

  // to get all roles related to user shop
  @OneToMany(() => ShopUserRoleModel, (shopRoleModel) => shopRoleModel.user)
  shopUserRoles: ShopUserRoleModel[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}

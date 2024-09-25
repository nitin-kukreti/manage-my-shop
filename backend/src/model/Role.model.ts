import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'Role' })
@Unique(['name'])
export class RoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

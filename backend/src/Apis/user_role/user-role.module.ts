import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopUserRoleModel } from 'src/model/UserRole.model';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopUserRoleModel])],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}

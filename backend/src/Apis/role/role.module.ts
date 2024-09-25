import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModel } from 'src/model/Role.model';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleModel])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

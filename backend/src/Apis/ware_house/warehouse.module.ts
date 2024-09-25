import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WareHouseModel } from 'src/model/WareHouse.model';
import { WareHouseService } from './warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([WareHouseModel])],
  providers: [WareHouseService],
  exports: [WareHouseService],
})
export class WareHouseModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModel } from 'src/model/Inventory.model';
import { InventoryService } from './inventory.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryModel]), ProductModule],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

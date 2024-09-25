import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModel } from 'src/model/Inventory.model';
import { OrderModel } from 'src/model/Order.model';
import { OrderItemModel } from 'src/model/OrderItem.model';
import { ProductModel } from 'src/model/Product.model';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderModel,
      OrderItemModel,
      ProductModel,
      InventoryModel,
    ]),
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

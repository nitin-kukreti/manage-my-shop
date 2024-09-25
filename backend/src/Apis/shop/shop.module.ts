import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopModel } from 'src/model/Shop.model';
import { UserRoleModule } from '../user_role/user-role.module';
import { RoleModule } from '../role/role.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ProductModule } from '../product/product.module';
import { InventoryModule } from '../inventory/inventory.module';
import { OrderModule } from '../order/order.module';
import { WareHouseModule } from '../ware_house/warehouse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopModel]),
    UserRoleModule,
    RoleModule,
    ProductModule,
    InventoryModule,
    OrderModule,
    WareHouseModule,
  ],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}

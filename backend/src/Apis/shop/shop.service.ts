import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopModel } from 'src/model/Shop.model';
import { DataSource, Repository } from 'typeorm';
import { UserRoleService } from '../user_role/user-role.service';
import { RoleService } from '../role/role.service';
import { ShopDto } from './shop.dto';
import {
  ProductCreateDto,
  ProductSearchDto,
  ProductUpdateDto,
} from '../product/product.dto';
import { ProductService } from '../product/product.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto } from '../order/order.dto';
import { OrderService } from '../order/order.service';
import {
  WarehouseDto,
  WareHouseSearch,
  WareHouseUpdateDto,
} from '../ware_house/wareHouse.dto';
import { WareHouseService } from '../ware_house/warehouse.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopModel) private shopRepository: Repository<ShopModel>,
    private readonly dataSource: DataSource,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly orderService: OrderService,
    private readonly warehouseService: WareHouseService,
  ) {}

  async createShop(payload: ShopDto, userId: number): Promise<ShopModel> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const shopObj = await this.shopRepository.create({
        name: payload.name,
      });
      const shop = await queryRunner.manager.save(shopObj);
      const role = await this.roleService.getRoleByName('shop_owner');
      await this.userRoleService.addShopPermission(
        shop.id,
        userId,
        role.id,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return shop;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createOrder(payload: CreateOrderDto, shopId: number) {
    await this.orderService.createOrder(payload, shopId);
  }

  async getShop(userId: number, name?: string): Promise<ShopModel[]> {
    const result = await this.userRoleService.getShopByUserId(userId, name);
    return result;
  }

  async getShopById(shopId: number) {
    const shop = await this.shopRepository.findOne({
      where: {
        id: shopId,
        shopUserRoles: {
          user: {
            userStatus: 'active',
          },
        },
      },
      relations: ['shopUserRoles', 'shopUserRoles.role', 'shopUserRoles.user'],
    });
    return shop;
  }

  async updateShop(shopId: number, payload: ShopDto) {
    const { affected } = await this.shopRepository.update(
      { id: shopId },
      {
        name: payload.name,
      },
    );
    if (affected === 0) throw new NotFoundException('Shop Not Found');
  }

  async deleteShop(shopId: number) {
    const { affected } = await this.shopRepository.softDelete({ id: shopId });
    if (affected === 0) throw new NotFoundException('Shop Not Found');
  }

  async getRoleShopIdUserId(shopId: number, userId: number) {
    return await this.userRoleService.getRoleShopIdUserId(shopId, userId);
  }

  async deleteShopPermission(shopId: number, roleId: number, userId: number) {
    await this.userRoleService.deleteShopRole(shopId, roleId, userId);
  }
  async addStaff(shopId: number, staffId: number) {
    const role = await this.roleService.getRoleByName('shop_staff');
    await this.userRoleService.addUserRole(shopId, staffId, role.id);
  }

  async getProductFromShop(shopId: number, payload: ProductSearchDto) {
    return await this.productService.getProduct(shopId, payload);
  }

  async getProductFromShopByProductId(shopId: number, productId: number) {
    return await this.productService.getProductById(shopId, productId);
  }
  async getProductFromShopByProductIdDetail(shopId: number, productId: number) {
    return await this.productService.getProductInventoryDetail(
      shopId,
      productId,
    );
  }

  async addProductToShop(shopId: number, payload: ProductCreateDto) {
    return await this.productService.createProduct(payload, shopId);
  }

  async updateShopProduct(
    productId: number,
    shopId: number,
    payload: ProductUpdateDto,
  ) {
    await this.productService.updateProduct(shopId, productId, payload);
  }

  async stockUpInventoryInWareHouse(
    productId: number,
    shopId: number,
    wareHouseId: number,
    quantity: number,
  ) {
    await this.inventoryService.addInventory(
      shopId,
      productId,
      quantity,
      wareHouseId,
    );
  }

  async consumeInventoryInWareHouse(
    productId: number,
    shopId: number,
    wareHouseId: number,
    quantity: number,
  ) {
    await this.inventoryService.consumeInventory(
      shopId,
      productId,
      quantity,
      wareHouseId,
    );
  }

  async createWareHouse(wareHouse: WarehouseDto, shopId: number) {
    await this.warehouseService.create(wareHouse, shopId);
  }

  async updateWareHouse(
    wareHouse: WareHouseUpdateDto,
    wareHouseId: number,
    shopId: number,
  ) {
    await this.warehouseService.update(wareHouseId, shopId, wareHouse);
  }

  async getWareHouse(shopId: number, payload: WareHouseSearch) {
    return await this.warehouseService.getWareHouseByShopId(shopId, payload);
  }
}

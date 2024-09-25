import {
  Body,
  Controller,
  Delete,
  Get,
  MethodNotAllowedException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ShopDto, ShopSearchDto, UpstockInventoryDto } from './shop.dto';
import { ShopService } from './shop.service';
import { JwtAccessTokenGuard } from 'src/common/guard/jwt_access_token.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { RoleEnum } from 'src/common/constant';
import {
  RoleDTO,
  ShopDetailResponseDTO,
  WareHouseCountResponseDto,
} from './shop.response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ProductCreateDto,
  ProductSearchDto,
  ProductUpdateDto,
} from '../product/product.dto';
import { NumberRangeDto } from 'src/common/dto/RangeDto';
import { ApiNestedQuery } from 'src/common/decorator/ApiNestedQuery.decorator';
import { ProductResponseDto } from '../product/product.response.dto';
import { CreateOrderDto } from '../order/order.dto';
import {
  WarehouseDto,
  WareHouseSearch,
  WareHouseUpdateDto,
} from '../ware_house/wareHouse.dto';
const { SHOP_OWNER, SHOP_STAFF } = RoleEnum;
@ApiTags('Shop')
@ApiSecurity('access-token')
@UseGuards(JwtAccessTokenGuard)
@Controller({ path: 'shop', version: '1' })
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Post()
  async createShop(@Req() req, @Body() data: ShopDto) {
    return await this.shopService.createShop(data, req.user.id);
  }

  @Get()
  async getShop(
    @Req() req,
    @Query() data: ShopSearchDto,
  ): Promise<ShopDetailResponseDTO[]> {
    console.log(req.user, data);
    const result = await this.shopService.getShop(req.user.id, data.name);
    return plainToInstance(ShopDetailResponseDTO, result);
  }

  @Get(':shopId')
  @Roles(SHOP_STAFF, SHOP_OWNER)
  @UseGuards(RoleGuard)
  async getShopDetailById(
    @Param('shopId', new ParseIntPipe()) shopId: number,
  ): Promise<ShopDetailResponseDTO> {
    const result = await this.shopService.getShopById(shopId);
    return plainToInstance(ShopDetailResponseDTO, result);
  }

  @Get(':shopId/user/:userId/roles')
  @Roles(SHOP_OWNER, SHOP_STAFF)
  @UseGuards(RoleGuard)
  async getShopUserRole(
    @Req() req,
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    console.log(req.user, shopId, userId);
    const result = await this.shopService.getRoleShopIdUserId(shopId, userId);
    return plainToInstance(RoleDTO, result);
  }

  @Get(':shopId/product')
  @ApiExtraModels(NumberRangeDto)
  @ApiNestedQuery(ProductSearchDto)
  @UseGuards(RoleGuard)
  async getProductOfShop(
    @Req() req,
    @Query() payload: ProductSearchDto,
    @Param('shopId', new ParseIntPipe()) shopId: number,
  ) {
    console.log(req.user, shopId, payload);
    const result = await this.shopService.getProductFromShop(shopId, payload);
    return plainToInstance(ProductResponseDto, result);
  }

  @Get(':shopId/product/:productId')
  async getProductOfShopById(
    @Req() req,
    @Query() payload: ProductSearchDto,
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('productId', new ParseIntPipe()) productId: number,
  ) {
    console.log(req.user, shopId, productId, payload);
    const result = await this.shopService.getProductFromShopByProductId(
      shopId,
      productId,
    );
    return plainToInstance(ProductResponseDto, result);
  }
  @Get(':shopId/product/:productId/detail')
  async getProductOfShopByIdDetail(
    @Req() req,
    @Query() payload: ProductSearchDto,
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('productId', new ParseIntPipe()) productId: number,
  ) {
    console.log(req.user, shopId, productId, payload);
    const result = await this.shopService.getProductFromShopByProductIdDetail(
      shopId,
      productId,
    );
    return plainToInstance(ProductResponseDto, result);
  }

  @Post(':shopId/product')
  @Roles(SHOP_OWNER)
  @UseGuards(RoleGuard)
  async addProduct(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Body() payload: ProductCreateDto,
  ) {
    console.log(shopId, payload);
    await this.shopService.addProductToShop(shopId, payload);
  }

  @Post(':shopId/order')
  @Roles(SHOP_OWNER)
  @UseGuards(RoleGuard)
  async createOrder(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Body() payload: CreateOrderDto,
  ) {
    console.log(shopId, payload);
    await this.shopService.createOrder(payload, shopId);
  }

  @Patch(':shopId/product/:productId')
  @Roles(SHOP_OWNER)
  @UseGuards(RoleGuard)
  async updateProduct(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('productId', new ParseIntPipe()) productId: number,
    @Body() payload: ProductUpdateDto,
  ) {
    console.log(shopId, productId, payload);
    await this.shopService.updateShopProduct(productId, shopId, payload);
  }

  @Put(':shopId')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async updateShopById(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Body() data: ShopDto,
  ) {
    return this.shopService.updateShop(shopId, data);
  }

  @Delete(':shopId')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async deleteShop(
    @Req() req,
    @Param('shopId', new ParseIntPipe()) shopId: number,
  ) {
    await this.shopService.deleteShop(shopId);
  }
  @Delete(':shopId/user/:userId/role/:roleId')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async deleteShopUserRole(
    @Req() req,
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('roleId', new ParseIntPipe()) roleId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    console.log(req.user, shopId, roleId);
    if (req.user.id === userId)
      throw new MethodNotAllowedException('Cannot delete own permission');
    await this.shopService.deleteShopPermission(shopId, roleId, userId);
  }

  @Post(':shopId/addStaff/:userId')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async addStaff(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('userId', new ParseIntPipe()) userId: number,
  ) {
    await this.shopService.addStaff(shopId, userId);
  }

  @Post(':shopId/warehouse')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async createWareHouse(
    @Body() payload: WarehouseDto,
    @Param('shopId', new ParseIntPipe()) shopId: number,
  ) {
    await this.shopService.createWareHouse(payload, shopId);
  }

  @Post(':shopId/warehouse/:warehouseId/product/:productId/upstock')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async upStockInventory(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('productId', new ParseIntPipe()) productId: number,
    @Param('warehouseId', new ParseIntPipe()) warehouseId: number,
    @Body() { quantity }: UpstockInventoryDto,
  ) {
    await this.shopService.stockUpInventoryInWareHouse(
      productId,
      shopId,
      warehouseId,
      quantity,
    );
  }
  @Post(':shopId/warehouse/:warehouseId/product/:productId/consume')
  @Roles('shop_owner')
  @UseGuards(RoleGuard)
  async consumeStockInventory(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('productId', new ParseIntPipe()) productId: number,
    @Param('warehouseId', new ParseIntPipe()) warehouseId: number,
    @Body() { quantity }: UpstockInventoryDto,
  ) {
    await this.shopService.consumeInventoryInWareHouse(
      productId,
      shopId,
      warehouseId,
      quantity,
    );
  }

  @ApiOkResponse({ type: WareHouseCountResponseDto })
  @Get(':shopId/warehouse')
  async getWareHouse(
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Query() search: WareHouseSearch,
  ): Promise<WareHouseCountResponseDto> {
    const wareHouse = await this.shopService.getWareHouse(shopId, search);
    console.log(wareHouse);
    return plainToInstance(WareHouseCountResponseDto, wareHouse);
  }

  @Patch(':shopId/warehouse/:warehouseId')
  async updateWareHouse(
    @Body() payload: WareHouseUpdateDto,
    @Param('shopId', new ParseIntPipe()) shopId: number,
    @Param('warehouseId', new ParseIntPipe()) warehouseId: number,
  ) {
    await this.shopService.updateWareHouse(payload, warehouseId, shopId);
  }
}

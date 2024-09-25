import { Injectable, NotFoundException } from '@nestjs/common';
import {
  WarehouseDto,
  WareHouseSearch,
  WareHouseUpdateDto,
} from './wareHouse.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { WareHouseModel } from 'src/model/WareHouse.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WareHouseService {
  constructor(
    @InjectRepository(WareHouseModel)
    private readonly wareHouseRepository: Repository<WareHouseModel>,
  ) {}

  async create({ location, name }: WarehouseDto, shopId: number) {
    const wareHouse = this.wareHouseRepository.create({
      location,
      name,
      shop: {
        id: shopId,
      },
    });
    await this.wareHouseRepository.save(wareHouse);
  }

  async update(
    ware_house_id: number,
    shopId: number,
    payload: WareHouseUpdateDto,
  ) {
    const { affected } = await this.wareHouseRepository.update(
      { id: ware_house_id, shop: { id: shopId } },
      payload,
    );
    if (affected === 0) throw new NotFoundException('Ware house not found');
  }

  async getWareHouseByShopId(shopId: number, search: WareHouseSearch) {
    const { page, pageSize, name, location } = search;
    const wareSearch: FindOptionsWhere<WareHouseModel> = {};
    if (name) wareSearch.name = ILike(`%${name}%`);
    if (location) wareSearch.location = ILike(`%${location}%`);
    wareSearch.shop = {
      id: shopId,
    };
    const [wareHouses, count] = await this.wareHouseRepository.findAndCount({
      where: wareSearch,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { wareHouses, count };
  }

  async getWareHouseShopIdAndWareHouseId(shopId: number, wareHouseId: number) {
    const wareHouse = await this.wareHouseRepository.findOne({
      where: {
        id: wareHouseId,
        shop: {
          id: shopId,
        },
      },
    });
    return wareHouse;
  }

  async getProduct(ware_house_id) {
    const ware_house = await this.wareHouseRepository.findOne({
      where: {
        id: ware_house_id,
      },
      relations: ['inventory.product'],
    });
    if (!ware_house) throw new NotFoundException('Ware house not found');
    const product = ware_house.inventory.map((item) => item.product);
    return product;
  }

  async getProductDetail(ware_house_id, product_id) {
    const ware_house = await this.wareHouseRepository.findOne({
      where: {
        id: ware_house_id,
        inventory: {
          product: {
            id: product_id,
          },
        },
      },
      relations: ['inventory', 'inventory.product'],
    });
    if (!ware_house) throw new NotFoundException('Ware house not found');
    return ware_house.inventory;
  }
}

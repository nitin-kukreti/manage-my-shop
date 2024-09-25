import { Exclude, Expose, Type } from 'class-transformer';
import { WarehouseDto } from '../ware_house/wareHouse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class RoleDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  userStatus: string;

  @Exclude()
  password: string;
}

export class ShopUserRoleDTO {
  @Expose()
  id: number;

  @Type(() => RoleDTO)
  @Expose()
  role: RoleDTO;

  @Type(() => UserDTO)
  @Expose()
  user: UserDTO;
}

export class ShopDetailResponseDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Type(() => ShopUserRoleDTO)
  @Expose()
  shopUserRoles: ShopUserRoleDTO[];
}

export class ShopDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class ShopRoleDTO {
  @Expose()
  id: number;

  @Type(() => RoleDTO)
  @Expose()
  role: RoleDTO;

  @Type(() => ShopDto)
  @Expose()
  shop: ShopDto;
}

export class WareHouseResponseDTO extends WarehouseDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  id: number;
}

export class WareHouseCountResponseDto {
  @ApiProperty({ type: WareHouseResponseDTO, isArray: true })
  @IsArray()
  @Type(() => WareHouseResponseDTO)
  @Expose()
  wareHouses: WareHouseResponseDTO[];

  @ApiProperty()
  @IsNumber()
  @Expose()
  count: number;
}

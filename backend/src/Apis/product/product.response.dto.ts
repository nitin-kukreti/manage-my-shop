import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class InventoryResponseDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  quantity: number;
}

export class ProductResponseDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  @IsString()
  description: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  price: number;

  @ApiProperty()
  @Expose()
  @IsString()
  category: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  availableQuantity: InventoryResponseDto;

  @ApiProperty({ isArray: true, type: InventoryResponseDto })
  @Expose()
  @Type(() => InventoryResponseDto)
  inventory: InventoryResponseDto[];
}

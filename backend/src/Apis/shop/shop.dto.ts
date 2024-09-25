import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ShopDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class ShopSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;
}

export class UpstockInventoryDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsPhoneNumber('IN')
  phoneNo: string;

  @ApiProperty({ type: () => OrderItemDto, isArray: true })
  @IsArray()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderSearchDto {
  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('IN')
  phoneNo: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(['todo', 'inprogress', 'done'])
  orderStatus: 'todo' | 'inprogress' | 'done';
}

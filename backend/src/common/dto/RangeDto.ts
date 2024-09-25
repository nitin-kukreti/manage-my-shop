import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export interface IRangeDto<T> {
  gte: T;
  lte: T;
}

export class NumberRangeDto implements IRangeDto<number> {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gte: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lte: number;
}

export class DateRangeDto implements IRangeDto<Date> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  gte: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  lte: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ required: false, default: 1, description: 'Records per page' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 1;
}

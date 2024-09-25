import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserRoleDto {
  @ApiProperty()
  @Expose()
  @IsString()
  role: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsNumber()
  shop: number;
}

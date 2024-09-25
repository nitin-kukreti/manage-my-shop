import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetAccessTokenResponseDto {
  @ApiProperty()
  @Expose()
  token: string;
}

export class AuthResponseDto {
  @ApiProperty()
  @Expose()
  token: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;
}

import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
export class AuthUserDto {
  @ApiProperty({
    description: 'Email for login',
    required: true,
    format: 'email',
    example: 'test@gmail.com',
  })
  @IsEmail({}, { message: 'Not a valid email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Password for login. Must include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    format: 'password',
    minLength: 8,
    example: 'Admin@12345',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;
}

export class BadRequestResponseDto {
  @ApiProperty({ example: ['Not a valid email', 'Password too weak'] })
  message: string[];
  @ApiProperty({ example: 'Bad Request' })
  error: string;
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
}

export class ConflictResponseDto {
  @ApiProperty({ example: 'Email already exists.' })
  message: string;
  @ApiProperty({ example: 'Conflict' })
  error: string;
  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({ example: 'Internal server error.' })
  message: string;
  @ApiProperty({ example: 'Internal Server Error' })
  error: string;
  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;
}

export class SuccessRegisterUserResponse {
  @ApiProperty({ example: 'user created' })
  @Expose()
  message: string;
}

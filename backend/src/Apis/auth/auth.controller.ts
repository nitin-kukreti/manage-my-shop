import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
// import { CorrelationIdInterceptor } from 'src/common/middleware/coreation-id.middleware';
import {
  AuthUserDto,
  BadRequestResponseDto,
  ConflictResponseDto,
  InternalServerErrorResponseDto,
  SuccessRegisterUserResponse,
} from './register.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshTokenGuard } from 'src/common/guard/jwt_refresh_token.guard';
import { plainToInstance } from 'class-transformer';
import { AuthResponseDto, GetAccessTokenResponseDto } from './response.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
// @UseInterceptors(CorrelationIdInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User successfully registered.',
    type: SuccessRegisterUserResponse,
  })
  @ApiBadRequestResponse({
    description: 'When request body not full fill criteria.',
    type: BadRequestResponseDto,
  })
  @ApiConflictResponse({
    description: 'When email already exists.',
    type: ConflictResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
    type: InternalServerErrorResponseDto,
  })
  @Post('register')
  async registerUser(
    @Body() payload: AuthUserDto,
    @Req() req,
    @Headers() header,
  ): Promise<SuccessRegisterUserResponse> {
    console.log(req, header);
    await this.authService.createUser(payload);
    const result = { message: 'created user successfully' };
    return plainToInstance(SuccessRegisterUserResponse, result);
  }

  @ApiOkResponse({})
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Body() payload: AuthUserDto, @Req() req) {
    console.log(req.user);
    const result = await this.authService.loginUser(req.user);
    return plainToInstance(AuthResponseDto, result);
  }

  @ApiSecurity('refresh-access-token')
  @UseGuards(JwtRefreshTokenGuard)
  @Post('get-token')
  async getToken(@Req() req) {
    console.log(req.user);
    const token = await this.authService.issueToken(req.user.id);
    const result = { token };
    return plainToInstance(GetAccessTokenResponseDto, result);
  }
}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/common/guard/jwt_access_token.guard';
import { plainToInstance } from 'class-transformer';
import { ShopRoleDTO } from '../shop/shop.response.dto';

@Controller({ path: 'user', version: '1' })
@ApiTags('User')
@ApiSecurity('access-token')
@UseGuards(JwtAccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('role')
  async getRole(@Req() req) {
    console.log(req.user);
    const result = await this.userService.getRoles(req.user.id);
    console.log(result);
    return plainToInstance(ShopRoleDTO, result);
  }
}

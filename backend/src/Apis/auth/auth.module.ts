import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from 'src/config/config.interface';
import { JwtRefreshStrategy } from './jwt.refresh-token.strategy';
import { JwtTokenStrategy } from './jwt.token.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariable>,
      ) => ({
        secret: configService.get('auth.secret', { infer: true }), // Get JWT secret from .env
        signOptions: {
          expiresIn: configService.get('auth.tokenExpire', { infer: true }), // Get expiration time from .env
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy, JwtTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from 'src/config/config.interface';

@Injectable()
export class JwtTokenStrategy extends PassportStrategy(Strategy, 'jwt-token') {
  constructor(configService: ConfigService<EnvironmentVariable>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

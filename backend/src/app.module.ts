import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/environment.config';
import { AuthModule } from './Apis/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'db/data-source';
import { ShopModule } from './Apis/shop/shop.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AuthModule,
    ShopModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

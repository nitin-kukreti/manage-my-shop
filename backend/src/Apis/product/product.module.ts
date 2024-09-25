import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModel } from 'src/model/Product.model';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel])],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities';
import { Products } from './entities';
import { AccessTokenStrategy } from '../middlewares';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Products])],
  controllers: [ProductsController],
  providers: [ProductsService, AccessTokenStrategy],
})
export class ProductsModule {}
